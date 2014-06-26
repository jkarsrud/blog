---
title: "First post"
date: 2014-06-22
template: post.hbs
---

This is a blog post!

It has fenced code blocks in it!

```javascript
(function() {
  // This is a comment inside a closure, but how does it look?
  this.prop = "propertyvalue";
  this.prop2 = true;

  this.method= function() {
    var something = this.prop2 ? "val1" : "val2";
  }.bind(this);
})();
```