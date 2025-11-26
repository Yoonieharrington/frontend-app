fetch('https://express-backend-9cfm.onrender.com/lessons')
  .then((res) => res.json())
  .then((data) => {
    this.lessons = data // or however you store lessons
  })
