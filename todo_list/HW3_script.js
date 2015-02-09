$(document).ready(function() {
	$('input[type=submit]').click(function(){
  		$("#todo-list").append("<li>"
  			+$("#todo-form-add").val()
  			+" "
  			+"<input type='image' id='imageRemove' class='todo-list-remove' src='RedCloseButton.png'/>"
  			+"</li>");
  		return false;
	});

	$(document).on("click", "#imageRemove", function(){
	   	$(this).parent('li').fadeOut();
	});

})

