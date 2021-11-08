const express = require('express');
const router = express.Router();
const Conversation = require('../models/conversation');

// New Conversation
router.post("/", async (req, res) => {
    const newConversation = new Conversation({
        members: [req.body.senderId, req.body.receiverId]
    });

    try {
        const savedConversation = await newConversation.save();
        res.status(200).json(savedConversation);
    } catch(err) {
        res.status(500).json(err);
    }
});

// Get a users conversation
router.get("/:userId", async (req, res) => {
    try {
        const conversations = await Conversation.find({
            members: { $in: [req.params.userId]}
        })
        res.status(200).json(conversations);
    } catch(err) {
        res.status(500).json(err);
    }
})

module.exports = router;