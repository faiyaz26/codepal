

(function() {
  "use strict";
  var langMapping = {
    	0 : "c_cpp",
    	1 : "c_cpp",
    	2 : "golang",
    	3 : "java",
    	4 : "javascript",
    	5 : "python",
    	6 : "python"
    };


    App.CodePad = {
    	init : function(){
    		App.CodePad.editor = ace.edit("editor");
    		App.CodePad.editor.getSession().setUseWorker(false);
			App.CodePad.editor.setTheme("ace/theme/crimson_editor");

			var initMode = 'ace/mode/' + langMapping[codePad.language];

			App.CodePad.editor.getSession().setMode(initMode);


			App.CodePad.editor.setValue(codePad.code, 1);

			App.CodePad.editor.setOptions({
				minLines : 50,
			    maxLines:  100,
			    showPrintMargin : false
			});

			$("#lang").val(codePad.language);

			if(codePad.readOnly === true){
				$("#lang").attr('disabled', 'disabled');
				App.CodePad.editor.setReadOnly(true);
			}


			App.CodePad.changed = 0;

			App.CodePad.editor.getSession().on('change', function() {
				App.CodePad.changed = 1;
				$('#save').text('Save');
			});
    	},
    	update: function(){
    		var btnSave = $('#save');
    		$.ajax({
		        url      : App.BaseUrl + '/' + codePad._id,
		        type     : 'POST',
		        dataType : "json",
		        data     : {
		          '_csrf': $('input[name="_csrf"]').val(),
		          code   : App.CodePad.editor.getValue(),
		          language : $('#lang').val()
		        },
		        beforeSend: function(xhr, opts){
		          btnSave.attr('disabled', 'disabled');
		          btnSave.text('Saving...');
		          NProgress.start();
		        }
		      })
		      .fail(function(res) {
		        NProgress.done();
		        btnSave.attr('disabled', false);
		        btnSave.text('Save');
		        if(_.isObject(res.responseJSON.error)) {
		          Notifier.show(res.responseJSON.error.message, 'err');
		        } else {
		          Notifier.show(res.responseJSON.message, 'err');
		        }
		      })
		      .done(function(res) {
		        NProgress.done();
		        btnSave.text('Saved');
		        //Notifier.show('Code Saved');
		        btnSave.attr('disabled', false);
		      });
    	},
    	checkAndUpdate : function(){
    		if(App.CodePad.changed == 1){
    			console.log("changed");
    			App.CodePad.changed = 0;
    			App.CodePad.update();
    		}
    	}
    };

    $('#save').click(function(){
    	App.CodePad.update();
    });

    $('#lang').on('change', function (ev) {
	    var val = $('option:selected').attr('value');
	    var mode = "ace/mode/"+langMapping[val];
	   // console.log(mode);
	    App.CodePad.editor.getSession().setMode(mode);

	    App.CodePad.changed = 1;
	});

    $(function() {
		App.CodePad.init();
		$(window).bind('keydown', function(event) {
		    if (event.ctrlKey || event.metaKey) {
		        switch (String.fromCharCode(event.which).toLowerCase()) {
			        case 's':
			            event.preventDefault();
			            App.CodePad.update();
			            break;
		        }
		    }
		});

		var checkForChange = setInterval(App.CodePad.checkAndUpdate, 5000);

	});
}());