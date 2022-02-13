const mongoose = require("mongoose");

// defining the schema
const todoSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  status: {
    type: String,
    enum: ["active", "inactive"],
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// custom instance methods
todoSchema.methods = {
  findActive: function () {
    return mongoose.model("TodoTable").find({ status: "active" });
  },
  findActiveCallback: function (cb) {
    mongoose.model("TodoTable").find({ status: "active" }, cb);
  },
};

// custom static methods
todoSchema.statics = {
  findByJs: function () {
    return this.find({ title: /js/i });
  },
};

// custom query helpers
todoSchema.query = {
  byLanguage: function (language) {
    return this.find({ title: new RegExp(language, "i") });
  },
};

module.exports = todoSchema;
