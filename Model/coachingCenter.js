const mongoose = require('mongoose');
const slugify = require('slugify');
const geocoder = require('./../config/geocoder')

const CoachingCenterSChema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      unique: true,
      trim: true,
      maxlength: [50, 'Name can not be more than 50 characters']
    },
    slug: String,
    description: {
      type: String,
      required: [true, 'Please add a description'],
      maxlength: [500, 'Description can not be more than 500 characters']
    },
    website: {
      type: String,
      match: [
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
        'Please use a valid URL with HTTP or HTTPS'
      ]
    },
    phone: {
      type: String,
      maxlength: [20, 'Phone number can not be longer than 20 characters']
    },
    email: {
      type: String,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email'
      ]
    },
    address: {
      type: String,
      required: [true, 'Please add an address']
    },
    location: {
      // GeoJSON Point
      type: {
        type: String,
        enum: ['Point']
      },
      coordinates: {
        type: [Number],
        index: '2dsphere'
      },
      formattedAddress: String,
      street: String,
      city: String,
      state: String,
      zipcode: String,
      country: String
    },
    careers: {
      // Array of strings
      type: [String],
      required: true,
      enum: [
        'SSC',
        'HSC',
        'JSC',
        'Medical Admission',
        'University Admission',
        'Engineering Admission',
        'Regular'
      ]
    },
    averageRating: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [10, 'Rating must can not be more than 10']
    },
    averageCost: Number,
    photo: {
      type: String,
      default: 'no-photo.jpg'
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    user:{
      type: mongoose.Schema.ObjectId,
      ref:'user',
      required:true
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);
// Creating Slug Field

CoachingCenterSChema.pre('save', function(next) {
    this.slug = slugify(this.name, { lower: true });
    next();
  });

// Geocode & create location field
CoachingCenterSChema.pre('save', async function(next) {
    const address = await geocoder.geocode(this.address);
    this.location = {
      type: 'Point',
      coordinates: [address[0].longitude, address[0].latitude],
      formattedAddress: address[0].formattedAddress,
      street: address[0].streetName,
      city: address[0].city,
      state: address[0].stateCode,
      zipcode: address[0].zipcode,
      country: address[0].countryCode
    };
    this.address = undefined;
    next();
  });

  
// Cascade delete courses when a coachingcenter is deleted
CoachingCenterSChema.pre('remove', async function(next) {
  console.log(`Courses being removed from coaching center ${this._id}`);
  await this.model('Course').deleteMany({ coachingcenter: this._id });
  next();
});

// Reverse populate with virtuals
CoachingCenterSChema.virtual('courses', {
  ref: 'Course',
  localField: '_id',
  foreignField: 'coachingcenter',
  justOne: false
});

module.exports = mongoose.model('CoachingCenter', CoachingCenterSChema);