import { Component } from 'react';
import firebase from './firebase.js';

class Bookshelf extends Component {
    constructor() {
        super();
        this.state = {
            savedBooks: []
        }
    }

    componentDidMount() {
        const dbRef = firebase.database().ref();
        dbRef.on('value', (data) => {
            const firebaseBookObj = data.val();
            console.log(firebaseBookObj);
            // const bookArray = for (let bookKey in firebaseBookObj) {
            //     const eachBook = bookKey.book;
            //     const finishedReading = bookKey.completed;
            //     return [...eachBook, finishedReading];
            // }
        });
    }

    render() {
        return(
            <div>

            </div>
        )
    }
}

export default Bookshelf;