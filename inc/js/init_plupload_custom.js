(function($) {

	jQuery(document).ready(function($) {
		
		//Init vars
		var LocalizedPluginVars = WpPrsoPluploadPluginVars;
		
		//console.log(LocalizedPluginVars);
		
		//Loop the plupload field init vars from wordpress and init plupload for each one
		jQuery.each( LocalizedPluginVars, function( key, PrsoPluploadVars ){
			
			//Init Plupload
			var uploader = new plupload.Uploader({
				// General settings
				runtimes : PrsoPluploadVars.runtimes,
				
				url : PrsoPluploadVars.wp_ajax_url,
				
				browse_button : PrsoPluploadVars.browse_button_dom_id, // you can pass in id...
				
				container: document.getElementById( PrsoPluploadVars.element ), // ... or DOM Element itself
				
				//Max file size
				max_file_size : PrsoPluploadVars.max_file_size,
				
				chunk_size: PrsoPluploadVars.chunking,
				
				unique_names : true,
				
				prevent_duplicates : PrsoPluploadVars.duplicates_status,
				
				multiple_queues : true,
				
				multipart_params : { 
					'action': 'prso-plupload-submit', 
					'currentFormID': PrsoPluploadVars.params.form_id,
					'currentFieldID': PrsoPluploadVars.params.field_id,
					'nonce': PrsoPluploadVars.params.nonce,
				},
		
				// Specify what files to browse for
				filters : {
					//Max file size
					max_file_size : PrsoPluploadVars.max_file_size,
					//Specifiy files to browse for
					mime_types: [
						{title : "files", extensions : PrsoPluploadVars.filters.files}
					]
				},
				
				// Flash settings
				flash_swf_url : PrsoPluploadVars.flash_url,
		
				// Silverlight settings
				silverlight_xap_url : PrsoPluploadVars.silverlight_url,
				
				//Post init events
				init : {
					Error: function(up, response) {
						
						
					},
					PostInit: function() {
						//Hide browser detection message
						document.getElementById('filelist').innerHTML = '';
						
			            document.getElementById('uploadfiles').onclick = function() {
			                uploader.start();
			                return false;
			            };
			        },
					FileUploaded: function(up, file, response) {
						
						//Called when a file finishes uploading
						
						var obj = jQuery.parseJSON(response.response);
						
						//Detect error
						if( obj.result === 'error' ) {
							
							//Alert user of error
							alert( obj.error.message );
							
							
						} else if( obj.result === 'success' ) {
							
							var inputField = '<input id="gform-plupload-'+ obj.file_uid +'" type="hidden" name="plupload['+ PrsoPluploadVars.params.field_id +'][]" value="'+ obj.success.file_id +'"/>';
							
							jQuery('#gform_' + PrsoPluploadVars.params.form_id).append(inputField);
							
						} else {
							
							//General error
							alert( PrsoPluploadVars.i18n.server_error );
							
						}
						
					},
					FilesAdded: function(up, selectedFiles) {
						
						var file_added_result = false;
						
						//Remove files if max limit reached
		                plupload.each(selectedFiles, function(file) {
		                	
		                	//File added result
		                	file_added_result = false;
		                	
		                    if (up.files.length > PrsoPluploadVars.max_files) {
								
								up.removeFile(file);;
		                        
		                        //Error
		                        alert( PrsoPluploadVars.i18n.file_limit_error );
		                        
		                        file_added_result = false;
		                        
		                    } else {
		                    
			                    file_added_result = true;
			                    
		                    }
		                    
		                });
		                
		                
		                //If file added then check if auto upload isset
	                    if( file_added_result === true ) {
	                    
	                    	plupload.each(selectedFiles, function(file) {
				                document.getElementById('filelist').innerHTML += '<div id="' + file.id + '">' + file.name + ' (' + plupload.formatSize(file.size) + ') <b></b></div>';
				            });
	                    	
	                    	if( PrsoPluploadVars.auto_upload === true ) {
	                    		up.start();
	                    	}
	                    }
		                
		            },
		            UploadProgress: function(up, file) {
			            document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = '<span>' + file.percent + "%</span>";
			        },
					FilesRemoved: function(up, files) {
						//console.log(files);
						//Remove hidden gforms input for this file
						jQuery("#gform-plupload-" + files[0].id).remove();
					
					}
				}
				
			});
			
			uploader.init();
			
		});
		
	});

})(jQuery);