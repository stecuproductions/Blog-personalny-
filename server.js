import express from "express";

const app = express();
const port = 3000;
const ip = "192.168.18.230";
var postsArray = [];

// Ustawienie silnika widoków EJS
app.set("view engine", "ejs");

// Middleware do parsowania danych formularza
app.use(express.urlencoded({ extended: true }));

// Ustawienie statycznego folderu public (np. dla CSS, obrazów)
app.use(express.static("public"));

// Konstruktor Post
function Post(title, content) {
  this.title = title;
  this.content = content;
}

// Trasa do wyświetlania formularza do stworzenia posta
app.post("/createPost", (req, res) => {
  res.render("generatePost.ejs");
});

// Trasa do obsługi danych nowego posta
app.post("/getNewPostContent", (req, res) => {
  var postTitle = req.body['post-title'];  // Pobieranie tytułu z formularza
  var postContent = req.body['post-content'];  // Pobieranie zawartości posta z formularza
  
  // Tworzenie nowego posta
  var myPost = new Post(postTitle, postContent);
  
  // Dodawanie posta do tablicy
  postsArray.push(myPost);

  // Przekierowanie na stronę główną, gdzie wyświetli się zaktualizowana lista postów
  res.redirect("/");  // Przekierowanie na ścieżkę "/"
});


app.post("/deletePost", (req, res) => {
  var deletedPostTitle= req.body["postTitle"];
  for (var y= 0; y< postsArray.length; y++){
    if (deletedPostTitle==postsArray[y].title){
      postsArray.splice(y, 1);
      break;
    }
  }
  res.redirect("/"); 

})

var editPostTitle="";
var editPostText= "";

app.post("/editPost", (req, res) => {
   editPostTitle = req.body["postTitle"];
   editPostText= req.body["postContent"];
  res.render("editPost.ejs", {
    editPostTitle:editPostTitle,
    editPostText : editPostText,
  })
})

app.post("/editPostContentButton", (req, res) =>{
  var newPostTitle= req.body["post-title"];
  var newPostText=req.body["post-content"];
  for (var z= 0; z< postsArray.length; z++){
    if (editPostTitle==postsArray[z].title){
      postsArray[z].title=newPostTitle;
      postsArray[z].content=newPostText;
      break;
    }
  }
  res.redirect("/");

})

app.get("/post/:title", (req, res) => {
  var postTitle = decodeURIComponent(req.params.title);  // Dekodowanie tytułu z URL
  
  var currentContent="";
  for (var x=0; x < postsArray.length; x++){
    if (postsArray[x].title===postTitle){
      currentContent=postsArray[x].content;
    }
  }
  // Szukanie posta po tytule w tablicy postsArray
  
    res.render("postView.ejs", {
      currentContent: currentContent,
      postTitle: postTitle,
    });
  })
 

// Trasa GET dla strony głównej
app.get("/", (req, res) => {
  res.render("index.ejs", {
    myPosts: postsArray,
  });
});

// Uruchomienie serwera
app.listen(port, ip, () => {
  console.log(`Listening on http://${ip}:${port}`);
});
