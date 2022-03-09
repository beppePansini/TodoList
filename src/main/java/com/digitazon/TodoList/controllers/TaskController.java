package com.digitazon.TodoList.controllers;

import com.digitazon.TodoList.entities.Task;
import com.digitazon.TodoList.repositories.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController //fa parsing risultati in json
@RequestMapping("/tasks")
public class TaskController {

    @Autowired
    private TaskRepository taskRepository;

    @GetMapping("/")
    public Iterable<Task> home() {
        Iterable<Task> tasks = taskRepository.findAll();
        System.out.println(tasks);
        return tasks;
    }

    @GetMapping("/{id}")
    public Task read(@PathVariable int id) { //prende prima variabile che arriva, avrà etichetti id e la utilizza dall'URL come argomento del metodo
        return taskRepository.findById(id).orElseThrow(); //.orElseThrow() per prendere il valore Optional
    }
}
