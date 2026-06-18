const express = require("express");
const router = express.Router();
const Event = require("../models/Event");


// POST EVENT
router.post("/events", async (req, res) => {
  try {
    const event = await Event.create(req.body);

    res.status(201).json({
      success: true,
      event,
    });
  } catch (error) {
    // Bad input (missing field, wrong event_type, etc.) should be a 400,
    // not a 500 — a 500 implies the server itself broke.
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


// GET SESSIONS
router.get("/sessions", async (req, res) => {
  try {
    const sessions = await Event.aggregate([
      {
        $group: {
          _id: "$session_id",
          eventCount: { $sum: 1 },
          firstSeen: { $min: "$timestamp" },
          lastSeen: { $max: "$timestamp" },
        },
      },
      {
        $sort: {
          lastSeen: -1,
        },
      },
    ]);

    res.json(sessions);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});


// GET EVENTS OF SESSION
router.get("/sessions/:sessionId", async (req, res) => {
  try {
    const events = await Event.find({
      session_id: req.params.sessionId,
    }).sort({
      timestamp: 1,
    });

    res.json(events);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});


// HEATMAP DATA
router.get("/heatmap", async (req, res) => {
  try {
    const pageUrl = req.query.page;

    const clicks = await Event.find({
      page_url: pageUrl,
      event_type: "click",
    }).select("click_x click_y timestamp");

    res.json(clicks);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});


// DISTINCT PAGES — used to populate the page-URL dropdown on the heatmap view
router.get("/pages", async (req, res) => {
  try {
    const pages = await Event.distinct("page_url");
    res.json(pages);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// TOP PAGES — ranks pages by total events, with unique-session counts
router.get("/top-pages", async (req, res) => {
  try {
    const pages = await Event.aggregate([
      {
        $group: {
          _id: "$page_url",
          totalEvents: { $sum: 1 },
          uniqueSessions: { $addToSet: "$session_id" },
        },
      },
      {
        $project: {
          _id: 0,
          page_url: "$_id",
          totalEvents: 1,
          sessionCount: { $size: "$uniqueSessions" },
        },
      },
      {
        $sort: { totalEvents: -1 },
      },
    ]);

    res.json(pages);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;