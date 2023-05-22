// var subjectObject = {
//   "Student": {
//     "Undergraduate Student": [],
//     "Postgraduate Student": [],
//     "Others": []    

//   },
//   "Librarian": {
//     "Medical Librarian": [],
//     "Government Librarian": [],
//     "Public Librarian": [],
//     "Subject Librarian": []
//   },
//   "Higher Education Professional": {
//     "Dean": [],
//     "Researcher": [],
//     "Department Head": [],
//     "Professor/Faculty": [],
//     "Program Coordinator": [],
//     "Researcher": []
//   }
// }
// window.onload = function() {
//   var subjectSel = document.getElementById("subject");
//   var topicSel = document.getElementById("topic");
//   for (var x in subjectObject) {
//     subjectSel.options[subjectSel.options.length] = new Option(x, x);
//   }
//   subjectSel.onchange = function() {
// //empty Chapters- and Topics- dropdowns
// chapterSel.length = 1;
// topicSel.length = 1;
//     //display correct values
//     for (var y in subjectObject[this.value]) {
//       topicSel.options[topicSel.options.length] = new Option(y, y);
//     }
//   }
//   topicSel.onchange = function() {
// //empty Chapters dropdown
// chapterSel.length = 1;
//     //display correct values
//     var z = subjectObject[subjectSel.value][this.value];
//     for (var i = 0; i < z.length; i++) {
//       chapterSel.options[chapterSel.options.length] = new Option(z[i], z[i]);
//     }
//   }
// }
function myFunction(c) 
{
    document.getElementById("subject").style.color = "black";
}

var subjectObject = {
    "Scholars": {
      "Undergraduate Student": ["Science", "Technology", "Fashion", "Computers"],
      "Postgraduate Student": ["Biotechnology", "Chemistry", "Graphics", "Physics"],
      "Others": ["Science", "Health", "Stock", "Business"]    
    },
    "Librarian": {
      "Medical Librarian": ["Biotechnology", "Cardiology", "Dermatology"],
      "Government Librarian": ["Politics", "Finance", "Accounts"]
    }
  }
  window.onload = function() {
    var subjectSel = document.getElementById("subject");
    var topicSel = document.getElementById("topic");
    var chapterSel = document.getElementById("chapter");
    for (var x in subjectObject) {
      subjectSel.options[subjectSel.options.length] = new Option(x, x);
    }
    subjectSel.onchange = function() {
//empty Chapters- and Topics- dropdowns
  chapterSel.length = 1;
topicSel.length = 1;
      //display correct values
      for (var y in subjectObject[this.value]) {
        topicSel.options[topicSel.options.length] = new Option(y, y);
      }
    }
    topicSel.onchange = function() {
chapterSel.length = 1;
      //display correct values
      var z = subjectObject[subjectSel.value][this.value];
      for (var i = 0; i < z.length; i++) {
        chapterSel.options[chapterSel.options.length] = new Option(z[i], z[i]);
      }
    }
  }