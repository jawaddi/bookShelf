// querySelector

// vars

// manipulation our data
let shelfControler = (function () {
  // here we we will storage our books
  let shelf = [];
  // Book Class:Respond a Book
  class Book {
    constructor(id, title, author, isbn) {
      this.id = id;
      this.title = title;
      this.author = author;
      this.isbn = isbn;
    }
  }
  // Book.prototype.print = function () {
  //   console.log(this);
  // };
  return {
    // addook function responsible for adding books to our shelf
    addBook: function (book) {
      // this id will help us to remove the right book from our shelf
      let id = 0;
      if (shelf.length !== 0) {
        id += shelf[shelf.length - 1].id + 1; // assign
      }
      // create new book
      let newBook = new Book(id, book.title, book.author, book.isbn);
      // add new book to our shelf
      // check if the book in shelf or not
      let togle = false;
      if (shelf.length > 0) {
        shelf.forEach((e) => {
          console.log(e.title === newBook.title);
          if (e.title === newBook.title) {
            togle = true;
          }
        });
        // the book is not in the shelf
        if (!togle) {
          shelf.push(newBook);
          // return new book cuz we want it to display it on out user interface
          return newBook;
        } else {
          return null;
        }
      } else {
        // first book that will enter the shelf
        shelf.push(newBook);
        return newBook;
      }
    },
    deleteBook: function (id) {
      // this id is the key for this function
      // we don't need entire objects just theer ids
      // I think map function is the right funtion for this task
      let ids = shelf.map((e) => {
        return e.id;
      });
      // here we will use the id that we received as parameter;
      ids.forEach((e) => {
        if (e === id) {
          // ssearching for the id in the array ids
          index = shelf.indexOf(id); // take the index's id
          shelf.splice(index, 1); // remove the book that has the id we don't have a method remove so we used this trick
          console.log(id);
        }
      });
    },
    // test: function () {
    //   console.log(shelf);
    // },
  };
})();
// manipulation our userinterface
let uiControler = (function () {
  // our dom slectors
  inputDom = {
    title: "#title",
    author: "#author",
    isbn: "#isbn",
    form: ".book-form",
    btn: ".btn",
    book_List: "#book-list",
    addSuccess: ".addsuccess",
  };
  return {
    // we have to return this cuz w e need it
    dom: inputDom,
    // get our book's data from users
    getinput: function () {
      // retun values
      return {
        title: document.querySelector(inputDom.title).value.trim(),
        author: document.querySelector(inputDom.author).value.trim(),
        // here we need to receive a number cuz I have never seen an isbn string :)
        isbn: parseInt(document.querySelector(inputDom.isbn).value),
      };
    },
    // after we get our data we need to clean the fields we are worries about our users we wanr them taking great experince with our products
    clearFields: function () {
      // clean fields
      document.querySelector(inputDom.form).reset();
      // move cursor to the first field
      document.querySelector(inputDom.title).focus();
      console.log("done");
    },

    // diplay books in userinterface
    displaybook: function (book) {
      // select destination

      document.querySelector(inputDom.book_List).innerHTML += `
      <tr id="book-${book.id}">
            <th>${book.title}</th>
            <th>${book.author}</th>
            <th>${book.isbn}</th>
            <th>
             
               <button class="btn btn-danger btn-sm rounded-0" type="button" data-toggle="tooltip" data-placement="top" title="Delete"><i class="fa fa-trash delete"></i></button>
              
            </th>
          </tr>

        `;

      // remove the class "d-none" cuz we want the user know that his book is add successful
      document.querySelector(inputDom.addSuccess).innerText = "book has beeb added";
      document.querySelector(inputDom.addSuccess).classList.remove("d-none");
      document.querySelector(inputDom.addSuccess).classList.remove("bg-danger");
      // add bootstrap class for background
      document
        .querySelector(inputDom.addSuccess)
        .classList.add("bg-success", "text-white");
      setTimeout(() => {
        // after second we want to hide that sign of succefull
        document
          .querySelector(inputDom.addSuccess)
          .classList.add("d-none", "bg-success");
      }, 2000);
    },
    // deleteBook: function (ids) {
    //   ids.forEach((element) => {});
    // },
  };
})();
// this is the link between ui and shelfcontroler
function controler(Ui, shelf) {
  Dom = Ui.dom;
  // events
  document.querySelector(Dom.form).addEventListener("submit", addBook);
  document.querySelector(Dom.btn).addEventListener("click", addBook);
  document.querySelector(Dom.book_List).addEventListener("click", deleteElemt);
  // this function will called when we click the button addbook or enter key to submit
  function addBook(e) {
    // strop refrech the page page
    e.preventDefault();
    // use our function that we get from uiControler to get book's data
    getBookValues = Ui.getinput();
    // console.log(getBookValues);
    // console.log(typeof getBookValues.isbn);

    // here we don't want to take empty values so we have to check them
    if (
      getBookValues.title !== "" &&
      getBookValues.author.value !== "" &&
      !Number.isNaN(getBookValues.isbn)
    ) {
      // add book to our data array
      let newBook = shelf.addBook(getBookValues);
      // diplay book if it doesn't have a copy yet
      if (newBook !== null) {
        console.log(newBook);
        Ui.displaybook(newBook);
      } else {
        // book exist in the shelf
        checkForError("this book is exist!!");
      }
    } else {
      // if fields empty we show a messgae that your haven't added
      checkForError("try again");
    }

    // clear fields
    Ui.clearFields();
  }
  // if the book is exist or empty fields
  function checkForError(hint) {
    document.querySelector(Dom.addSuccess).innerText = hint;
    document.querySelector(Dom.addSuccess).classList.remove("d-none");
    document
      .querySelector(Dom.addSuccess)
      .classList.add("bg-danger", "text-white");
    setTimeout(() => {
      document
        .querySelector(Dom.addSuccess)
        .classList.add("d-none", "bg-danger");
    }, 2000);
  }
  //  delete elment from userInterface
  // the magic will happens here cuz event delegation and bubbling
  function deleteElemt(e) {
    if (e.target.classList.contains("delete")) {
      // check that we click on the trsh icon
      let deleted_book = e.target.parentElement.parentElement.parentElement; // select the entire book

      // add classe to hide it from the userInterface
      deleted_book.classList.add("d-none");
      // get id to send it to our shelf
      id = deleted_book.id;
      // console.log(id);
      newId = id.split("-");
      // this our id
      newId = Number(newId[1]);
      // lets ddelte our book from shelf
      shelf.deleteBook(newId);
      checkForError("book has been deleted");
    }
  }
}
controler(uiControler, shelfControler);
