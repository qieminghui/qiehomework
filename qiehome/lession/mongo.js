var mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/waijian')

var personSchema = new mongoose.Schema({
    name: String,
    age: Number,
    addr: String
});

var personModel = mongoose.model('person',personSchema)

var courseSchema = new mongoose.Schema({
    name: String,
    teacher: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'person'
    }
});

var courseModel = mongoose.model('course',courseSchema)

//personModel.create({name:'陈超',age:20,addr:'北京'},function(err,personInfo){
//    if(!err){
//        courseModel.create({name:'angular',teacher:personInfo._id},function(err,courseInfo){
//            if(!err){
//                console.log(courseInfo)
//            }else{
//                console.log(err)
//            }
//        })
//    }else{
//        console.log(err)
//    }
//})

courseModel.findOne({name:'angular'})
    .populate('teacher')
    .exec(function(err,doc){
        if(!err){
            console.log(doc)
        }else{
            console.log(err)
        }
    })