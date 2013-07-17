var mongo = require('mongodb');
 
var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

/*
 * Le code est inspiré de cette page : http://coenraets.org/blog/2012/10/creating-a-rest-api-using-node-js-express-and-mongodb/
 */
 
var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('labo7_exercice2', server, {'w': 'journal'});
 
db.open(function(err, db) {
    if(!err) {
        console.log("Connecté à la base de donnée");
        db.collection('wiki', {strict:true}, function(err, collection) {
            if (err) {
                console.log("La collection 'wiki' n'existe pas. Nous allons la créer et rajouter des données de base");
                populateDB();
            }
        });
    }
});

exports.findByTitle = function(req, res) {
    var titre = req.params.title;
    console.log('Recherche des wikis avec le titre : ' + titre);
    db.collection('wiki', function(err, collection) {
        collection.find({'titre': new RegExp(titre)}).toArray(function(err, objets) {
            if(err) {
                console.log('Erreur sur la récupération de wiki!');
                res.send(500, 'Erreur interne');
            } else {
                res.json(objets);
            }
        });
    });
};

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Récupératoin du wiki id : ' + id);
    /*
     * 0- Compléter la recherche par ID. On retourne qu'un seul objet.
     */
    /*
     * Note : j'ai modifier le URL de la route, il y avait confusion avec findByTitle.
     */
    db.collection('wiki', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, objet) {
            if(err) {
                console.log('Erreur sur la récupération de wiki!');
                res.send(500, 'Erreur interne');
            } else {
                res.json(objet);
            }
        });
    });
};

exports.findAll = function(req, res) {
    /*
     * 1- Compléter la recherche de tous les wiki
     */
    console.log('Recherche de tous les wikis')
    db.collection('wiki', function(err, collection) {
        collection.find().toArray(function(err, objets) {
            if(err) {
                console.log('Erreur sur la récupération de wiki!');
                res.send(500, 'Erreur interne');
            } else {
                res.json(objets);
            }
        });
    });

};
 
exports.addWiki = function(req, res) {
    var wiki = req.body;
    console.log('Ajout du wiki : ' + JSON.stringify(wiki));
    /*
     * 2- Compléter l'ajout de wiki
     */
    db.collection('wiki', function(err, collection) {
        collection.insert(wiki, {safe:true}, function(err, result) {
            if (err) {
                console.log('Erreur sur l\'ajout de wiki!');
                res.send(500, 'Erreur interne');
            } else {
                res.send(result[0]);
            }
        });
    });
}
 
exports.updateWiki = function(req, res) {
    var id = req.params.id;
    var wiki = req.body;
    console.log('Mise à jour du wiki : ' + id);
    console.log(JSON.stringify(wiki));
    /*
     * 3- Compléter la mise à jour du wiki. La mise à jour ecrase tout le document.
     */
    db.collection('wiki', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, wiki, {safe:true}, function(err, result) {
            if (err) {
                console.log('Erreur sur la modification de wiki!');
                res.send(500, 'Erreur interne');
            } else {
                console.log(result + ' document mis a jour');
                res.send(wiki);
            }
        });
    });
}
 
exports.deleteWiki = function(req, res) {
    var id = req.params.id;
    /*
     * 4- Suppression d'un wiki
     */
    var id = req.params.id;
    db.collection('wiki', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                console.log('Erreur sur la suppression de wiki!');
                res.send(500, 'Erreur interne');
            } else {
                console.log(result + ' wiki(s) supprimé');
                res.send(req.body);
            }
        });
    });
}
 
var populateDB = function() {
 
    var wikis = [
    {
        'titre': 'Node.js',
        'contenu': "Node.js is a server-side software system designed for writing scalable Internet applications, notably web servers.[1] Programs are written on the server side in JavaScript, using event-driven, asynchronous I/O to minimize overhead and maximize scalability.[2] Node.js contains a built-in HTTP server library, making it possible to run a web server without the use of external software, such as Apache or Lighttpd, and allowing more control of how the web server works. Node.js enables web developers to create an entire web application in JavaScript, both server-side and client-side. Source : https://en.wikipedia.org/wiki/Nodejs",
        'auteur': ['Jean-Philippe Caissy'],
    },
    {
        'titre': 'Injection SQL',
        'contenu': "Une injection SQL est un type d'exploitation d'une faille de sécurité d'une application interagissant avec une base de données, en injectant une requête SQL non prévue par le système et pouvant compromettre sa sécurité. Source: https://fr.wikipedia.org/wiki/Injection_SQL",
        'auteur': ['Jacques Berger', 'Jean-Philippe Caissy'],
    }];
 
    db.collection('wiki', function(err, collection) {
        collection.insert(wikis, {safe:true}, function(err, result) {});
    });
 
};
