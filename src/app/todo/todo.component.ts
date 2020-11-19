import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  editID: number;
  editStatus: boolean;
  toDoList: TODO[];
  priorityList: string[] = ['low', 'medium', 'high'];
  constructor(private fb: FormBuilder, private _snackBar: MatSnackBar) {}

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
    console.log(due);
    console.log(typeof due);
    let newTodo = { desc, priority, due, complete: false };
    let now = new Date();
    let add = Date.parse(this.form.value.due);
    // if more than negative 1, means overdued, time to UTC
    let dateDiff = (add - now.getTime()) / 1000 / 3600 / 24;
    if (this.editStatus === true) {
      this.edit(this.editID, newTodo);
      return;
    }
    if (dateDiff > -1) {
      let todo = this.getLSItem();
      if (todo) {
        todo.push(newTodo);
        this.setToDoToLS(todo);
      } else {
        this.setToDoToLS([newTodo]);
      }
      this.setToDoList();
      this.form.reset();
      this.notification('New Todo Added', 'dismiss');
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

  setToDoToLS(todo: TODO[]) {
    localStorage.setItem('todo', JSON.stringify(todo));
  }

  clearLS() {
    localStorage.clear();
    this.setToDoList();
    this.notification('All ToDo Removed', 'dismiss');
  }

  deleteSingleToDo(i: number) {
    let todo = this.getLSItem();
    todo.splice(i, 1);
    this.setToDoToLS(todo);
    this.setToDoList();
    this.notification(`${todo[i].desc} deleted`, 'dismiss');
  }

  completeSingleToDo(i: number) {
    let todo = this.getLSItem();
    todo[i].complete = !todo[i].complete;
    this.setToDoToLS(todo);
    this.setToDoList();
    let text = todo[i].complete ? 'completed!' : `due on ${todo[i].due}`;
    this.notification(`${todo[i].desc} ${text}`, 'dismiss');
  }

  notification(text: string, action: string) {
    this._snackBar.open(text, action, {
      duration: 2000,
    });
  }
  editToDo(i: number) {
    this.editID = i;
    this.editStatus = true;
    let todos = this.getLSItem();
    let itemToEdit = todos[i];
    this.form.patchValue(itemToEdit);
  }

  clearEditToDo() {
    this.editStatus = false;
    this.form.reset();
  }

  edit(id: number, todo: TODO) {
    let todos = this.getLSItem();
    todos[id] = todo;

    this.setToDoToLS(todos);
    this.setToDoList();
    this.notification('edit success', 'dismiss');
    //Clear status
    this.clearEditToDo();
  }
}
