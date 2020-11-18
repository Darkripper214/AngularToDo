import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface TODO {
  desc: string;
  priority: string;
  due: Date;
  complete: boolean;
}

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css'],
})
export class TodoComponent implements OnInit {
  errorMsg: boolean = false;
  form: FormGroup;
  toDoList: TODO[];
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      desc: ['', Validators.required],
      priority: ['', Validators.required],
      due: ['', Validators.required],
    });

    this.setToDoList();
    console.log(typeof this.toDoList[0].complete);
  }

  onSubmit() {
    let { desc, priority, due } = this.form.value;
    let newTodo = { desc, priority, due, complete: false };
    let now = new Date();
    let add = Date.parse(this.form.value.due);
    // if more than negative 1, means overdued, time to UTC
    let dateDiff = (add - now.getTime()) / 1000 / 3600 / 24;
    if (dateDiff > -1) {
      let todo = this.getLSItem();
      if (todo) {
        todo.push(newTodo);
        localStorage.setItem('todo', JSON.stringify(todo));
      } else {
        localStorage.setItem('todo', JSON.stringify([newTodo]));
      }
      this.setToDoList();
      return;
    } else {
      alert('cannot add overdued task');
      this.errorMsg = true;
      setTimeout(() => {
        this.errorMsg = false;
      }, 3000);
    }
  }

  log() {
    console.log(this.toDoList);
  }

  getLSItem() {
    return JSON.parse(localStorage.getItem('todo'));
  }

  setToDoList() {
    this.toDoList = this.getLSItem();
  }

  clearLS() {
    localStorage.clear();
    this.setToDoList();
  }

  deleteSingleToDo(i: number) {
    let todo = this.getLSItem();
    todo.splice(i, 1);
    localStorage.setItem('todo', JSON.stringify(todo));
    this.setToDoList();
  }

  completeSingleToDo(i: number) {
    let todo = this.getLSItem();
    todo[i].complete = !todo[i].complete;
    localStorage.setItem('todo', JSON.stringify(todo));
    this.setToDoList();
  }
}
