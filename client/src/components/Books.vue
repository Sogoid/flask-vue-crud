<template>
  <div class="container">
    <div class="row">
      <div class="col-sm-10">
        <h1>Books</h1>
        <hr/>
        <br/><br/>
        <alert v-if="showMessage" :message="message"></alert>
        <button
            class="btn btn-success btn-sm"
            type="button"
            @click="toggleAddBookModal">
          Add Book
        </button>
        <br/><br/>
        <table class="table table-hover">
          <thead>
          <tr>
            <th scope="col">Title</th>
            <th scope="col">Author</th>
            <th scope="col">Read?</th>
            <th></th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(book, index) in books" :key="index">
            <td>{{ book.title }}</td>
            <td>{{ book.author }}</td>
            <td>
              <span v-if="book.read">Yes</span>
              <span v-else>No</span>
            </td>
            <td>
              <div class="btn-group" role="group">
                <button
                    class="btn btn-warning btn-sm"
                    type="button"
                    @click="toggleEditBookModal(book)">
                  Update
                </button>
                <button
                    class="btn btn-danger btn-sm"
                    type="button"
                    @click="handleDeleteBook(book)">
                  Delete
                </button>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <!-- add new book modal -->
  <div
      ref="addBookModal"
      :class="{ show: activeAddBookModal, 'd-block': activeAddBookModal }"
      class="modal fade"
      role="dialog"
      tabindex="-1">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Add a new book</h5>
          <button
              aria-label="Close"
              class="close"
              data-dismiss="modal"
              type="button"
              @click="toggleAddBookModal">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form>
            <div class="mb-3">
              <label class="form-label" for="addBookTitle">Title:</label>
              <input
                  id="addBookTitle"
                  v-model="addBookForm.title"
                  class="form-control"
                  placeholder="Enter title"
                  type="text"/>
            </div>
            <div class="mb-3">
              <label class="form-label" for="addBookAuthor">Author:</label>
              <input
                  id="addBookAuthor"
                  v-model="addBookForm.author"
                  class="form-control"
                  placeholder="Enter author"
                  type="text"/>
            </div>
            <div class="mb-3 form-check">
              <input
                  id="addBookRead"
                  v-model="addBookForm.read"
                  class="form-check-input"
                  type="checkbox"/>
              <label class="form-check-label" for="addBookRead">Read?</label>
            </div>
            <div class="btn-group" role="group">
              <button
                  class="btn btn-primary btn-sm"
                  type="button"
                  @click="handleAddSubmit">
                Submit
              </button>
              <button
                  class="btn btn-danger btn-sm"
                  type="button"
                  @click="handleAddReset">
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  <div v-if="activeAddBookModal" class="modal-backdrop fade show"></div>
  <!-- edit book modal -->
  <div
      ref="editBookModal"
      :class="{ show: activeEditBookModal, 'd-block': activeEditBookModal }"
      class="modal fade"
      role="dialog"
      tabindex="-1">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Update</h5>
          <button
              aria-label="Close"
              class="close"
              data-dismiss="modal"
              type="button"
              @click="toggleEditBookModal">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form>
            <div class="mb-3">
              <label class="form-label" for="editBookTitle">Title:</label>
              <input
                  id="editBookTitle"
                  v-model="editBookForm.title"
                  class="form-control"
                  placeholder="Enter title"
                  type="text">
            </div>
            <div class="mb-3">
              <label class="form-label" for="editBookAuthor">Author:</label>
              <input
                  id="editBookAuthor"
                  v-model="editBookForm.author"
                  class="form-control"
                  placeholder="Enter author"
                  type="text">
            </div>
            <div class="mb-3 form-check">
              <input
                  id="editBookRead"
                  v-model="editBookForm.read"
                  class="form-check-input"
                  type="checkbox">
              <label class="form-check-label" for="editBookRead">Read?</label>
            </div>
            <div class="btn-group" role="group">
              <button
                  class="btn btn-primary btn-sm"
                  type="button"
                  @click="handleEditSubmit">
                Submit
              </button>
              <button
                  class="btn btn-danger btn-sm"
                  type="button"
                  @click="handleEditCancel">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  <div v-if="activeEditBookModal" class="modal-backdrop fade show"></div>
</template>

<script>
import axios from "axios";
import Alert from "./Alert.vue";

export default {
  data() {
    return {
      activeAddBookModal: false,
      addBookForm: {
        id: "",
        title: "",
        author: "",
        read: [],
      },
      activeEditBookModal: false,
      editBookForm: {
        id: '',
        title: '',
        author: '',
        read: [],
      },
      books: [],
      message: "",
      showMessage: false,
    };
  },
  components: {
    alert: Alert,
  },
  methods: {
    addBook(payload) {
      const path = "http://localhost:5001/books";
      axios
          .post(path, payload)
          .then(() => {
            this.getBooks();
            this.message = "Book added";
            this.showMessage = true;
          })
          .catch((error) => {
            console.log(error);
            this.getBooks();
          });
    },
    getBooks() {
      const path = "http://localhost:5001/books";
      axios
          .get(path)
          .then((res) => {
            this.books = res.data.books;
          })
          .catch((error) => {
            console.error(error);
          });
    },
    handleAddReset() {
      this.initForm();
    },
    handleAddSubmit() {
      this.toggleAddBookModal();
      let read = false;
      if (this.addBookForm.read[0]) {
        read = true;
      }
      const payload = {
        title: this.addBookForm.title,
        author: this.addBookForm.author,
        read, // property shorthand
      };
      this.addBook(payload);
      this.initForm();
    },
    initForm() {
      this.addBookForm.title = "";
      this.addBookForm.author = "";
      this.addBookForm.read = [];
      this.editBookForm.id = "";
      this.editBookForm.title = "";
      this.editBookForm.author = "";
      this.editBookForm.read = [];
    },
    toggleAddBookModal() {
      const body = document.querySelector("body");
      this.activeAddBookModal = !this.activeAddBookModal;
      if (this.activeAddBookModal) {
        body.classList.add("modal-open");
      } else {
        body.classList.remove("modal-open");
      }
    },
    toggleEditBookModal(book) {
      if (book) {
        this.editBookForm = book;
      }
      const body = document.querySelector("body");
      this.activeEditBookModal = !this.activeEditBookModal;
      if (this.activeEditBookModal) {
        body.classList.add("modal-open");
      } else {
        body.classList.remove("modal-open");
      }
    },
    handleEditSubmit() {
      this.toggleEditBookModal(null);
      let read = false;
      if (this.editBookForm.read) read = true;
      const payload = {
        title: this.editBookForm.title,
        author: this.editBookForm.author,
        read,
      };
      this.updateBook(payload, this.editBookForm.id);
    },
    updateBook(payload, bookID) {
      const path = `http://localhost:5001/books/${bookID}`;
      axios.put(path, payload)
          .then(() => {
            this.getBooks();
            this.message = 'Book updated!';
            this.showMessage = true;
          })
          .catch((error) => {
            console.error(error);
            this.getBooks();
          });
    },
    handleEditCancel() {
      this.toggleEditBookModal(null);
      this.initForm();
      this.getBooks(); // why?
    },
    handleDeleteBook(book) {
      this.removeBook(book.id);
    },
    removeBook(bookID) {
      const path = `http://localhost:5001/books/${bookID}`;
      axios.delete(path)
          .then(() => {
            this.getBooks();
            this.message = 'Book removed!';
            this.showMessage = true;
          })
          .catch((error) => {
            console.error(error);
            this.getBooks();
          });
    },
  },
  created() {
    this.getBooks();
  },
};
</script>
