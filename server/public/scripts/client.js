console.log('js');

$(document).ready(function () {
  console.log('JQ');
  // Establish Click Listeners
  setupClickListeners()
  // load existing koalas on page load
  getKoalas();

}); // end doc ready

function setupClickListeners() {
  $('#addButton').on('click', handleSubmit)
  $('#viewKoalas').on('click', '.js-btn-delete', handleDelete);
  $('#viewKoalas').on('click', '.js-btn-markAsReady', handleTransfer);
}

function handleSubmit() {
  //creating Koala object to send to server
  let koalaToSend = {
    name: $('#nameIn').val(),
    age: $('#ageIn').val(),
    gender: $('#genderIn').val(),
    readyForTransfer: $('#readyForTransferIn').val(),
    notes: $('#notesIn').val(),
  };

// call saveKoala with the new object
postKoala(koalaToSend);

//clearing Input Fields
$('#nameIn').val('');
$('#ageIn').val('');
$('#genderIn').val('');
$('#readyForTransferIn').val('');
$('#notesIn').val('');
};

function handleDelete(event) {
  const buttonDataObject = $(this).data();
  console.log('in handle Delete');
  const koalaID = buttonDataObject.id;
   
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.value) {
      deleteKoala(koalaID);
      Swal.fire(
        'Deleted!',
        'Your file has been deleted.',
        'success'
      )
    }
  });
};

function handleTransfer(event){
  const buttonDataObject = $(this).data();
  console.log('in handle Transfer');
  const koalaID = buttonDataObject.id;

  transferKoalas(koalaID);
}


function getKoalas() {
  console.log('in getKoalas');
  // ajax call to server to get koalas

} // end getKoalas

//add koala to database
function postKoala(koalaToSend) {
  console.log('in saveKoala', koalaToSend);
  // ajax call to server to get koalas
  $.ajax({
    type: 'POST',
    url: '/koalas',
    data: koalaToSend,
  }).then(function (response) {
    console.log('Response from server: ', response);
    getKoalas();
  }).catch(function (error) {
    console.log('Error in POST', error);
    alert('Unable to add koala at this time. Please try again later.');
  })
}

// getKoalas will get all koalas from the server and render to page
function getKoalas() {
  $.ajax({
    type: 'GET',
    url: '/koalas'
  }).then(function (response) {
    console.log(response);
    renderKoalas(response);
  }).catch(function (error) {
    console.log('error in GET', error);
  });
}

//delete a book from the database
function deleteKoala(id) {
  $.ajax({
    type: 'DELETE',
    url: `/koalas/${id}`,
  }).then(function (response) {
    console.log('Response from server.', response);
    getKoalas();
  }).catch(function (error) {
    console.log('Error in DELETE', error)
    alert('Unable to delete koala at this time. Please try again later.');
  });
}

//marks book as read in database
function transferKoalas(id){
  $.ajax({
    type: 'PUT',
    url: `/koalas/${id}`,
    }).then(function(response) {
      console.log('Response from server.', response);
      // getKoalas();
    }).catch(function(error) {
      console.log('Error in PUT', error)
      alert('Unable to update koala at this time. Please try again later.');
    });
}


// Displays an array of koalas to the DOM
function renderKoalas(koalas) {
  $('#viewKoalas').empty();

  for (let i = 0; i < koalas.length; i += 1) {
    let koala = koalas[i];
    // For each book, append a new row to our table

    let $tr = $('<tr></tr>');
    $tr.data('koala', koala);
    $tr.append(`<td>${koala.name}</td>`);
    $tr.append(`<td>${koala.age}</td>`);
    $tr.append(`<td>${koala.gender}</td>`);
    $tr.append(`<td>${koala.ready_to_transfer}</td>`);
    $tr.append(`<td>${koala.notes}</td>`);

    if(koala.ready_to_transfer =='N'){
      $tr.append(`<td><button class="js-btn-markAsReady btn" data-id="${koala.id}">Ready for Transfer</button></td>`)
    }else{
      $tr.append(`<td>  </td>`);
    }
    
    $tr.append(`<button class="js-btn-delete btn" data-id="${koala.id}">Delete</button></td>`);
    $('#viewKoalas').append($tr);
  }
}