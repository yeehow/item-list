function closecomment(){
          $('.comment').html('')
          $('.commentholder').fadeOut('slow')
          $('#cm_btn').attr('onclick','')
}
function closecomment2(){
          $('.comment').html('')
          $('.commentholder').fadeOut('slow')

}
        function comment(ser){
          $('.backgr').fadeIn('slow')
          $('.comment').html('')
          $('.commentholder').fadeIn('slow')
        // CHANNEL_ID is defined in the index.ejs file
    const drone = new Scaledrone(CHANNEL_ID);
    drone.on('open', error => {
      if (error) {
        return console.error(error);
      }
    });
    
    drone.on('close', event => console.log('Connection was closed', event));
    drone.on('error', error => console.error(error));
    const room = drone.subscribe("observable-comment-"+ser, {
      historyCount: 30 // ask for the 100 latest messages from history
    });
    room.on('history_message', ({data}) => {
      console.log(data);
      addcommentItemToTop(data);
    });
    room.on('data', data => {
      console.log(data);
      addcommentItemToTop(data);
    });
    //------------- DOM STUFF
    const DOM = {
      submitButton: document.querySelector('.cms_s'),
      textarea: document.querySelector('.cm_input'),
      comment: document.querySelector('.comment'),
    };
    DOM.submitButton.addEventListener('click', sendMessage);
    function sendMessage() {
      const value = DOM.textarea.value;
      if (!value) {
        return;
      }
      drone.publish({
        room: "observable-comment-"+ser,
        message: {
          commentMessage: value,
          color: generateRandomColorHex(),
          id:ser
        },
      });
      DOM.textarea.value = '';
    }
    function addcommentItemToTop(item) {
      DOM.comment.insertBefore(createcommentItem(item), DOM.comment.firstChild);
    }
    function createcommentItem(item) {
      const {commentMessage, color} = item;
      const el = document.createElement('div');
      el.appendChild(document.createTextNode(commentMessage));
      el.className = 'comment-item';
      el.style.borderBottomColor = color;
      return el;
    }
    function generateRandomColorHex() {
      return '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16);
    }
  }