const express = require('express');
const ObjectId = require('mongodb').ObjectId;

router = express.Router();

router.get('/list/', (req, res) => {
    const db = req.app.locals.db;

    db.collection('transcripts').find({}).project({
        filename: 1,
        length: 1,
        uploadDate: 1
    }).toArray((err, result) => {
        if (err) {
            return res.status(500).json({
                error: 'something went wrong'
            })
        }

        res.json(result);
    });
});

router.get('/list/:id', (req, res) => {
    const db = req.app.locals.db;

    db.collection('transcripts')
    .findOne({
        _id: ObjectId(req.params.id)
    }, 
    {
        projection: {
            filename: 1,
            length: 1,
            uploadDate: 1,
            transcript: 1
        }
    }).then((result, err) => {
        if (err) {
            return res.status(500).json({
                error: 'something went wrong'
            })
        }

        res.json(result);
    });
});

router.post('/list/:id', (req, res) => {
    const db = req.app.locals.db;

    db.collection('transcripts').updateOne({
        _id: ObjectId(req.params.id)
    }, {
        $set: {
            transcript: req.body
        }
    }, {
        upsert: true
    })

    res.json({
        error: null,
        status: 'ok'
    });
});

router.get('/list/:id/download', (req, res) => {
    const db = req.app.locals.db;

    db.collection('transcripts')
    .findOne({
        _id: ObjectId(req.params.id)
    }, 
    {
        projection: {
            filename: 1,
            length: 1,
            uploadDate: 1,
            transcript: 1
        }
    }).then((result, err) => {
        if (err) {
            return res.status(500).json({
                error: 'something went wrong'
            })
        }

        responseText = [];
        result.transcript.forEach(row => {
            responseText.push(row.speech);
        });

        res.set({
            'Content-Type': 'plain/text',
            'Content-Disposition': `attachment; filename="${req.params.id}.txt"`
        });

        res.send(responseText.join('\n\n'));
    });
})


module.exports = router;