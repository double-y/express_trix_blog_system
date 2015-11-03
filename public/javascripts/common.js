/**
 * Created by yasudayousuke on 11/2/15.
 */
$(function(){
    $(document).on('click','input#message_form_submit_input', function(e){
        e.preventDefault();
        var trix_element = document.querySelector("trix-editor");
        var trix_editor_dom = trix_element.editor.getDocument();
        document.querySelector("#message_box").innerHTML = trix_element.innerHTML;
        console.log(trix_editor_dom);
    })
});