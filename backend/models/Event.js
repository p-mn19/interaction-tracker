const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  session_id: {
    type: String,
    required: true,
    index: true,
  },

  event_type: {
    type: String,
    enum: ["page_view", "click"],
    required: true,
  },

  page_url: {
    type: String,
    required: true,
    index: true,
  },

  timestamp: {
    type: Date,
    default: Date.now,
  },

  click_x: {
    type: Number,
    default: null,
  },

  click_y: {
    type: Number,
    default: null,
  },

  element_text: {
    type: String,
    default: null,
  },
});

module.exports = mongoose.model("Event", EventSchema);