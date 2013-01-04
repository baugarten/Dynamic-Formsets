Dynamic-Formsets
================

Helps create formsets with a variable number of form elements

Formsets in Django are annoying because having a variable number of models in the form requires updating a manager form and some fancy javascript.
This plugin takes care of everything for you!

## Installation
Include script after the jQuery library (unless you are packaging scripts somehow else):

    <script src="/path/to/jquery.cookie.js"></script>
Do not include the script directly from GitHub (http://raw.github.com/...). GitHub is not a CDN.

## Usage

An example initial html is shown

    <div id="form-container">
      <input name="form-TOTAL_FORMS" value="3" />
      <input name="form-INITIAL_FORMS" value="2" />
      <div class="song">
        <label for="...">
        <input id="id_form-0-name" name="form-0-name">
        <input id="id_form-0-otherfield" name="form-0-otherfield">
        <span class="remove"></span>
      </div>
      <div class="song">
        <label for="...">
        <input id="id_form-0-name" name="form-0-name">
        <input id="id_form-0-otherfield" name="form-0-otherfield">
        <span class="remove"></span>
      </div>
      <div class="song">
        <label for="...">
        <input id="id_form-0-name" name="form-0-name">
        <input id="id_form-0-otherfield" name="form-0-otherfield">
        <span class="remove"></span>
      </div>
      <div class="controls">
      </div>
    </div>

    $("#form-container").dynamicFormset({
      model: ".song",
      addWrapper: ".controls",
      addHtml: "<a class='btn btn-primary'>Add Song</a>", 
      removeWrapper: ".remove",
    });

## Configuration

All of the configuration options are shown below

    prefix: "form", // The prefix for the formset
    model: ".formset", // A selector for each of the top level model object
    addWrapper: false, // A selector that serves as the wrapper around the add button for finer placement. If false, will append to the bottom of the form
    addClass: "addbtn", // A class for the add button
    addHtml: false,
    removeWrapper: false, // A selector that serves as the wrapper around the add button for finer placement. If false, will append to the wrapper
    removeClass: "removebtn", // A class for the remove button  
    removeHtml: false,
    addAnimation: 'slideDown', // The animation to use when a new item is added
    addAnimationTime: 300, // The amount of time the add animation should take
    removeAnimation: 'slideUp', // The animation to use when an item is removed
    removeAnimationTime: 300, // The amount of time the remove animation should take 

## Contact

I plan on maintaining this. Any questions please email <baugarten@gmail.com>
