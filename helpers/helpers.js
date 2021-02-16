const moment= require('moment');

module.exports={
   
   formatDate:function(date,format){
   return moment(date).utcOffset("+05:30").format(format)
   },

   truncate:function(str,len){
       if(str.length>len && str.length>0){
          let new_str=str.substr(0,len);
          return new_str+'...';
       }
       return str;
   },


   stripTags:function(input){
      return input.replace(/<(?:.|\n?)*?>/gm,'')
   },

   editIcon:function(storyUser,LoggedUser,storyId,floating=true){
      if(storyUser._id.toString() == LoggedUser._id.toString()){
         if(floating)
         {
             return `<a href="/Stories/edit/${storyId}" class="btn btn-primary floating"> <i class="fas fa-edit fa-small"></i></a>`
         }else{
             return `<a href="/Stories/edit/${storyId}" class="btn btn-primary"> <i class="fas fa-edit fa-small"></i></a>`
         }
      }else{
         return '';
      }
   },
   
}