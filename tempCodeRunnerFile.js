startingContent
<!-- <%- include('partials/header'); -%>  

<div>
  <h1>Home</h1>
  <p> <%= startingContent %></p>
  <h3 id="add" ><a href="/compose">Add New</a></h3>
     <% posts.forEach(function(post){ %>
      <div>
        <h1> <%= post.title %></h1>
      </div>
      <div>
       <p ><%= post.content.substring(0,100) + "..." %> <a href="/posts/<%= post._id %>">Read More</a></p>  
      </div>
    <% }); %>  
  </div>
</div>

  <%- include('partials/footer'); -%> -->