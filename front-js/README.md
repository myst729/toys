# front.js

A simple template engine written in JavaScript.


**How to use**

+ Parse `sourceData` with `templateString`, and return the result as a string.

```js
front(templateString, sourceData);
```

+ Parse `sourceData` with `templateString`, then replace content of `targetNode` with the result.

```js
front(templateString, sourceData, targetNode);
```

+ Parameters  
  + `templateString`  
  The template to be translated.  
  Supports *@if/@endif* and *@if/@else/@endif* statements.  
  Supports retrieve data from deep structure.  

  + `sourceData`  
  The data to be parsed.  
  Must either be an object or array.  
  The engine will automatically iterate if passed value is an array.  

  + `targetNode` (optional)  
  The DOM element to place the result.  


**Example**

+ Write your web page like this:

```html
<ul id="members"></ul>
<script type="text/template" id="member">
    <li class="member">
      <h3>{{name}}</h3>

      @if{{info.age}}
      <p>Age: {{info.age}}</p>
      @endif
      
      @if{{info.job.fulltime}}
      <p>Job: {{info.job.fulltime}}</p>
      @else
      <p>Available for hire</p>
      @endif
    </li>
</script>

<script src="front.js"></script>
<script>  
    var template = document.getElementById("member").innerHTML;  
    var target = document.getElementById("members");  
    var source = [{
          name: "Gary",
          info: {
            age: 24,
            job: {
              fulltime: 'Web Developer'
            }
          }
        }, {
          name: "Fred"
        }];

    front(template, source, target);
</script>
```
+ And you will get:

```html
  <ul id="members">  
    <li class="member">  
      <h3>Gary</h3>  
      <p>Age: 24</p>  
      <p>Job: Web Developer</p>  
    </li>  
    <li class="member">  
      <h3>Fred</h3>  
      <p>Available for hire</p>  
    </li>  
  </ul>
```
