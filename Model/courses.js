const mongoose = require('mongoose');
const colors = require('colors');

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Please add a course title']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  weeks: {
    type: String,
    required: [true, 'Please add number of weeks']
  },
  tuition: {
    type: Number,
    required: [true, 'Please add a tuition cost']
  },
  scholarshipAvailable: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  coachingcenter: {
    type: mongoose.Schema.ObjectId,
    ref: 'CoachingCenter',
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
});

// Static method to get avg of course tuitions
CourseSchema.statics.getAverageCost = async function(coachingCenterId) {
    const obj = await this.aggregate([
      {
        $match: { coachingcenter: coachingCenterId }
      },
      {
        $group: {
          _id: '$coachingcenter',
          averageCost: { $avg: '$tuition' }
        }
      }
    ]);
    
    try {
      await this.model('CoachingCenter').findByIdAndUpdate(coachingCenterId, {
        averageCost: Math.ceil(obj[0].averageCost / 10) * 10
      });
    } catch (err) {
      console.error(err);
    }
  };
  
  // Call getAverageCost after save
  CourseSchema.post('save', function() {
    this.constructor.getAverageCost(this.coachingcenter);
  });
  
  // Call getAverageCost before remove
  CourseSchema.pre('remove', function() {
    this.constructor.getAverageCost(this.coachingcenter);
  });
  
  
module.exports = mongoose.model('Course', CourseSchema);