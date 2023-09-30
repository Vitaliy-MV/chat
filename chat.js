var Chat, langChat;
window.onload = function (){
// Click on button "open chat" (no matter where), open window and load data user 
// exactly who press on the button. Difference just in window "invite" and "load chat by <option>",
// if this users familiar. So, here first request on server: get Chat for Principal by this URL
// ............................................................................................  
langChat = 'ru';		// languege this (Principal) user;
switch (langChat){
case 'ru': accept="принять"; reject="отклонить"; break;
case 'en': accept="accept"; reject="cancel"; break;
case 'he': accept="מסכים"; reject="ביטול";
}
Chat = {
  iOwner : false,		// I'm owner this page (URL);
  status : 'invited', 		// relative to URL (by Principal), where was click & relative to chat load ("deleted", "invited", "created", "blocked");
  inviterReq : 101, 		// requests for open chat to This (Principal) user;
  invitedReq : 100, 		// requests for open chat to owner this page (URL);
  idOwner : '123',		// ID owner this page (URL);
  nameOwner : 'unamed',		// name owner this page (URL);
  chatBody : 'Some chat...',	// load by "statusChat" history; (last 30 messages);
  listOption : 'html',		// html block <select> for This (Principal) user;
//listUnread : 'html',		// html block "Unread" for This (Principal) user;
//listInvites : 'html',		// html block "invites" for This (Principal) user;
  listInvites : '<div id="UID1" class="panel panel-info b10"><div class="panel-heading"><a href="#">User Name 1</a><span style="float:right;"><span class="btn btn-default btn-xs" onclick="acceptChat(\'UID1\', \'User Name 1\')">'+accept+'</span><span class="btn btn-default btn-xs" onclick="rejectChat(\'UID1\')">'+reject+'</span></span></div></div><div id="UID2" class="panel panel-info b10"><div class="panel-heading"><a href="#">User Name 2</a><span style="float:right;"><span class="btn btn-default btn-xs" onclick="acceptChat(\'UID2\', \'User Name 2\')">'+accept+'</span><span class="btn btn-default btn-xs" onclick="rejectChat(\'UID2\')">'+reject+'</span></span></div></div>',
  listUnread : '<div id="ChatID" class="panel panel-info b10"><div class="panel-heading"><img src="/media/No-logo.png" style="width:50px; padding-right: 10px;"\><a href="#" onclick="closeChat();">User Name</a><span class="btn btn-default glyphicon glyphicon-cloud-download" style="float:right;" onclick="loadChatUnread(\'ChatID\')"> </span></div></div><div id="id4" class="panel panel-info b10"><div class="panel-heading"><img src="/media/No-logo.png" style="width:50px; padding-right: 10px;"\><a href="#" onclick="closeChat();">User Name</a><span class="btn btn-default glyphicon glyphicon-cloud-download" style="float:right;" onclick="loadChatUnread(\'id4\')"> </span></div></div>'
 };
}
function openChat(){
// === Set window "Chat" =>
// ........................
var div = $('#chat-block');
$(div).css('display', 'block');
$('#open-chat').css('display', 'none');
$(div).find('.chat-message-box').append('<textarea id="chatBox"></textarea>');
CKEDITOR.config.toolbar = [
   ['Bold','Italic','Underline','Strike','Blockquote','TextColor','BGColor','Smiley']
];
CKEDITOR.config.height = 70;
CKEDITOR.replace('chatBox');
const lang = langChat;
var statusChat = Chat.status;
//$(div).find('#USERS').empty().append(Chat.listOption);

var invite, inviteQ, tooManyR;
switch(lang){
case 'ru' : invite='пригласить'; inviteQ='Пригласить <b>'+Chat.nameOwner+'</b> в чат?'; tooManyR='У <b>'+Chat.nameOwner+'</b> больше 101 не принятых приглашений. Новые не принимаются.'; break;
case 'en' : invite='invite'; inviteQ='Invite <b>'+Chat.nameOwner+'</b> to chat?'; tooManyR='<b>'+Chat.nameOwner+'</b> has more than 101 unaccepted invitations. New are not accepted.'; break;
case 'he' : invite='להזמין'; inviteQ='?לדבר <b>'+Chat.nameOwner+'</b> להזמין'; tooManyR='.יש יותר מ-101 הזמנות. חדשים לא יתקבלו '+'<b>'+Chat.nameOwner+'</b>'+'-ל';
}

// if iOwner == false && idOwner not exist on the chat list this Principal && if (invitedReq < 101) =>
// ...................................................................................................
const check = $('#USERS option[value="'+Chat.idOwner+'"]').val();
if (!Chat.iOwner && !check){
let message;
 if (Chat.invitedReq < 101){
	message = '<div id="info-panel" class="panel panel-info b10"><div class="panel-heading">'+inviteQ+'<span style="float:right;"><span class="btn btn-default btn-xs" onclick="inviteToChat(\''+lang+'\', '+Chat.idOwner+')">'+invite+'</span></span></div></div>';
 }else{
	message = '<div id="info-panel" class="panel panel-info b10"><div class="panel-heading">'+tooManyR+'</div></div>';
 }
$(div).append('<div class="glyphicon glyphicon-remove-circle close-data-block" onclick="closeInfoBlock()"></div><div id="winInfo"><div class="chat-block-info">'+message+'</div></div>');
}
if(!Chat.iOwner && check){
$('#USERS').val(Chat.idOwner);
setChatByStatus(lang, statusChat, Chat.chatBody);
}
var selected, id;
var listUnread = Chat.listUnread;
const menu = $('#USERS option')[0].text;
$('#USERS').change(function(e) {
selected = $('#USERS option:selected').text();
id = $(this).val();
  if(selected!=menu){
  // Request on server: get statusChat, chatBody
  // for "This" witch user "selected" id =>
  // ......................................
   if(listUnread.indexOf(id)!=-1){
   $(div).find('#cleaner').append(listUnread).find('#'+id).remove();
   Chat.listUnread = $(div).find('#cleaner').html();
   $('#cleaner').empty();
   var count = 0;
   count = parseInt($(div).find('#unreads').find('.badge').text());
   count--;
   if(count>=0){
     $(div).find('#unreads').find('.badge').text(count);
     const winOpen = '#chat-block .close-data-block';
	if ($(winOpen).hasClass("close-data-block")){
    	$('#chat-block').find('#'+id).remove();
	if(count==0){ closeInfoBlock(); }
	}
   }else{
     Chat.listUnread ='';
   }
  }
setChatByStatus(lang, statusChat, Chat.chatBody);
}
else {
lockChatButtons();
$(div).find('.chat-viewport').empty();
// Is List MENU : here can be adverts or some message...
$('#options-chat .glyphicon-remove').attr('disabled', true);
  }
});
// Close window chat
document.addEventListener('click', function (event){
  if(event.target.closest('.chat-close')){
  CKEDITOR.instances.chatBox.destroy();
  closeChat();
  }
// Window "Invitations"
if(event.target.closest('#invitations')){
const winOpen = '#chat-block .close-data-block';
const count = parseInt($(div).find('#invitations').find('.badge').text());
if (count!=0 && $(winOpen).hasClass("close-data-block")==false){
   invitations(lang);
   }
}
// Window "Unread"
if(event.target.closest('#unreads')){
const winOpen = '#chat-block .close-data-block';
const count = parseInt($(div).find('#unreads').find('.badge').text());
if (count!=0 && $(winOpen).hasClass("close-data-block")==false){
  unread(Chat.listUnread);
   }
}
});
// Button send
document.addEventListener('click', function (event){
  if(event.target.closest('#send-to-chat')){
  const button = $(div).find('.glyphicon-send').attr('disabled');
  if (button!='disabled'){
    var message = CKEDITOR.instances.chatBox.getData();
    CKEDITOR.instances.chatBox.setData('');
    $(div).find('.chat-viewport').append(message);
    $(div).find('.chat-viewport').animate({scrollTop: $('html, body').get(0).scrollHeight},500);

    // send on server message and write to file "chat".
    // print to chanel /chat "new massage: for "la-la-la-la" Who is that?
    // ..................................................................
   }
  }
});
}

function invitations(lang){
var div = $('#chat-block');
var windowName, rejectAll;
switch (lang){
case "ru": windowName="<b>Приглашения</b>"; rejectAll='<span class="btn btn-default glyphicon glyphicon-trash" style="margin-top:-5px;" onclick="rejectAll()"> Все</span>'; break;
case "en": windowName="<b>Invitations</b>"; rejectAll='<span class="btn btn-default glyphicon glyphicon-trash" style="margin-top:-5px;" onclick="rejectAll()"> All</span>'; break;
case "he": windowName="הזמנות"; rejectAll='<span class="btn btn-default glyphicon glyphicon-trash" style="margin-top:-5px;" onclick="rejectAll()"> הכל</span>';
}
var dataS = Chat.listInvites;
$(div).append('<div class="glyphicon glyphicon-remove-circle close-data-block" onclick="closeInfoBlock()"></div><div id="winInfo">'+rejectAll+'<span class="win-chat-info">'+windowName+'</span><div class="chat-block-info">'+dataS+'</div></div>');
}

function inviteToChat(lang, id){
var name = 'Name owner page';
$('#USERS').append('<option value="'+id+'">'+name+'</option>');
var message;
switch (lang){
case 'ru' : message = '<i>приглашение в ожидании...</i>'; break;
case 'en' : message = '<i>invitation panding...</i>'; break;
case 'he' : message = '...הזמנה ממתינה';
}
$('#USERS').val(id);
$('#chat-block').find('.chat-viewport').append(message);
$('#options-chat .glyphicon-remove').attr('disabled', false);
closeInfoBlock();
// Request on server: set invite to invited by page URL from inviter by Principal, 
// add user on Chat list this Principal and set label "invitation panding" =>
// ..........................................................................
}

function acceptChat(reqUID, name){
$('#USERS').val(0);
var div = $('#chat-block');
const idDiv='#'+reqUID;
const userName = name;
var message;
switch(langChat){
case 'ru' : message='Чат создан. Пользователь <b>'+userName+'</b> в вашем списке.<hr\>'; break;
case 'en' : message='Chat was created. User <b>'+userName+'</b> in your list.<hr\>'; break;
case 'he' : message='<b>'+userName+'</b> ציאט נוצר. ברשימה שלך'+'<hr\>';
}
$(div).find('#USERS').append('<option value="'+reqUID+'">'+userName+'</option>');
$(div).find('.chat-viewport').empty().append(message);
$('#options-chat .glyphicon-remove').attr('disabled', true);
var count=0;
count = parseInt($(div).find('#invitations').find('.badge').text());
count--;
if (count==0){
   $(div).find('#invitations').find('.badge').text(0);
   closeInfoBlock();
  }
else {
$(div).find('#invitations').find('.badge').text(count);
 }
$(div).find(idDiv).remove();
$(div).find('#cleaner').append(Chat.listInvites).find('#'+reqUID).remove();
Chat.listInvites = $(div).find('#cleaner').html();
$('#cleaner').empty();
// Request on server: Create new chat by reqUID; 
// Call to inviter (reqUID - chat created).  =>
// ............................................
}

function rejectChat(reqUID){
var div = $('#chat-block');
var count = parseInt($(div).find('#invitations').find('.badge').text());
count--;
if (count==0){
   $(div).find('#invitations').find('.badge').text(0);
   closeInfoBlock();
  }
else{
  $(div).find('#invitations').find('.badge').text(count);
  $(div).find('#'+reqUID).remove();
  $(div).find('#cleaner').append(Chat.listInvites).find('#'+reqUID).remove();
  Chat.listInvites = $(div).find('#cleaner').html();
  $('#cleaner').empty();
// Request on server: reject ID=reqUID by Principal; =>
// .....................................................
  }
}

function rejectAll(){
var message;
switch (langChat){
case 'ru' : message = 'Удалить все приглашения?'; break;
case 'en' : message = 'Remove all invitations?'; break;
case 'he' : message = 'למחוק הכל?';
}
let del = confirm(message);
    if (del){
    $('#chat-block').find('#invitations').find('.badge').text('0');
    Chat.listInvites = '';
    closeInfoBlock();
   }
// Request on server: rejectAll by Principal =>
// ............................................
}

function setChatByStatus(lang, statusChat, chat){
var history;
var div = $('#chat-block');
 if(statusChat=='invited') {
  let message;
    switch (lang){
    case 'ru' : message = '<i>приглашение в ожидании...</i>'; deleted='Чат удалён.'; break;
    case 'en' : message = '<i>invitation panding...</i>'; deleted='Chat deleted.'; break;
    case 'he' : message = '...הזמנה ממתינה'; deleted='Chat deleted.';
    }
    history = message;
    lockChatButtons();
  }
  else if (statusChat=='blocked'){
    history = chat;
    lockChatButtons();
  }
  else if (statusChat=='deleted'){
  let deleted;
  switch (lang){
    case 'ru' : deleted='Чат удалён собеседником.'; break;
    case 'en' : deleted='Chat partner deleted the chat.'; break;
    case 'he' : deleted='הציאט נמחק הצד השני';
    }
    history = deleted;
    lockChatButtons();
    $('#options-chat .glyphicon-remove').attr('disabled', true);
    $('#USERS option:selected').remove();
  }
  else{
    history = chat;
    $('#send-to-chat .glyphicon-send').attr('disabled', false);
  }
$(div).find('.chat-viewport').empty().html(history);
}

function unread(htmlBlock){
const div = $('#chat-block');
$(div).append('<div class="glyphicon glyphicon-remove-circle close-data-block" onclick="closeInfoBlock()"></div><div id="winInfo"><div class="chat-block-info">'+htmlBlock+'</div></div>');
}

function loadChatUnread(id){
const div = $('#chat-block');
// Request on server: Get Chat id =>
// ..................................
$(div).find('#USERS').val(id);
const history = 'Some chat...'
const statusChat = 'created';
$(div).find('.chat-viewport').empty().text(history);
if (statusChat!='blocked' && statusChat!='invited'){
    unlockChatButtons();
}
var count = 0;
count = parseInt($(div).find('#unreads').find('.badge').text());
count--;
if (count==0){
   $(div).find('#unreads').find('.badge').text(0);
   closeInfoBlock();
  }
$(div).find('#unreads').find('.badge').text(count);
$(div).find('#'+id).remove();
$(div).find('#cleaner').append(Chat.listUnread).find('#'+id).remove();
Chat.listUnread = $(div).find('#cleaner').html();
$('#cleaner').empty();
}

function unlockChatButtons(){
$('#options-chat .ru').attr('disabled', false);
$('#options-chat .en').attr('disabled', false);
$('#options-chat .he').attr('disabled', false);
$('#send-to-chat .glyphicon-send').attr('disabled', false);
$('#options-chat .glyphicon-trash').attr('disabled', false);
$('#options-chat .glyphicon-lock').attr('disabled', false);
$('#options-chat .glyphicon-remove').attr('disabled', false);
}
function lockChatButtons(){
$('#options-chat .ru').attr('disabled', true);
$('#options-chat .en').attr('disabled', true);
$('#options-chat .he').attr('disabled', true);
$('#send-to-chat .glyphicon-send').attr('disabled', true);
$('#options-chat .glyphicon-trash').attr('disabled', true);
$('#options-chat .glyphicon-lock').attr('disabled', true);
$('#options-chat .glyphicon-remove').attr('disabled', false);
}

function cleanChat(){
var message, clean;
var div = $('#chat-block');
switch (langChat){
case 'ru' : message = 'Стереть все сообщения?'; clean="удалил все сообщения"; break;
case 'en' : message = 'Remove all messages?'; clean="deleted all messages"; break;
case 'he' : message = 'למחוק הכל?'; clean="מחק את כל ההודעות";
}
let del = confirm(message);
    if (del){
var dat = new Date();
const time = dat.toLocaleTimeString();
const UID = $('#USERS').val();
// Request on server: Clen chat; Principal ID + UID; return name and set message =>
// .................................................................................
$(div).find('.chat-viewport').empty().html('<i><b>name</b> '+clean+' | '+time+'</i>');
   }
}

function deleteChat(){
var message, m;
var div = $('#chat-block');
switch (langChat){
case 'ru' : message = 'Удалить этот чат и'; m='из вашего списка?'; break;
case 'en' : message = 'Delete this chat'; m="from your list?"; break;
case 'he' : message = 'מחק את הציאט הזה ו'; m="מרשימה שלך?";
}
const id = $('#USERS').val();
const name = $('#USERS option:selected').text();
message = message+' '+name+' '+m;
let del = confirm(message);
    if (del){
const UID = $('#USERS').val();
// Request on server: Delete chat; Principal ID + UID; =>
// ......................................................
$('#USERS option[value='+id+']').remove();
$(div).find('.chat-viewport').empty();
$('#USERS option')[0].selected=true;
$('#options-chat .glyphicon-remove').attr('disabled', true);
 }
}

function translateCh(lang){
}

function closeInfoBlock(){
var div = $('#chat-block');
$(div).find('.close-data-block').remove();
$(div).find('#winInfo').remove();
}

function closeChat(){
closeInfoBlock();
const div = $('#chat-block');
$(div).find('.chat-viewport').empty();
$('#USERS').off('change');
$(div).unbind('click');
$(div).css("display","none");
$('#open-chat').css('display', '');
$(div).find('#chatBox').remove();
}