var APP = {};
APP.data = [];
APP.sampleData = {
	"id": "",
	"blocktitle": "",
			"stages": [{
				"id": "",
				"title": "",
				"img": "",
					"checkpoints": [{
						"requiredCP": "",
						"id": "",
						"title": "",
						"description": "",
						"url": "",
						"urlText": "",
						"type": "",
							"instances": [{
								"id": "",
								"prompt": "",
								"placeholder": ""
							}],
								"criteria": [{
									"id": "",
									"key": "",
									"value": ""
							}],
							"routeFileName": ""
		}]
	}],
	 "version": "1.0"
 };


$(document).ready(function() {



	$(document).on("click", "#addBtn", function() {
		 $("[func='add-block']").click();
	});

	$(document).on("click", "#dldBtn", function() {
    	var json_file="";
    	filename = $("#fileName").val();
			checkpointType = $("#type").val();
			// disableChecked = $("#disableChecked").val();

    	if(filename==""){
    		alert("Input your filename first");
    		return;
    	} else if (checkpointType=="") {
				alert("Please select the checkpoint type");
    		return;
    	}


    	json_file = JSON.stringify(APP.data, undefined, 4);


		var hiddenElement = document.createElement('a');
			hiddenElement.href = 'data:attachment/text,' + encodeURI(json_file);
			hiddenElement.target = '_blank';
			hiddenElement.download = filename+'.JSON';
		hiddenElement.click();
    });



	$(document).on("change dp.change", "[type=text][name], select[name]", function() {
		var array = $(this).attr("array");
		var name = $(this).attr("name");
		var blockIndex = $(this).closest("[name=block]").attr("index");
		var stagesIndex = $(this).closest("[name=stages]").attr("index");
		var fieldTypeIndex = $(this).closest("[name=checkpoints]").attr("index");
		var subitemIndex = $(this).closest("[name=instances]").attr("index");
		var subitemIndex2 = $(this).closest("[name=criteria]").attr("index");
		var blockData = APP.data[blockIndex];

		if (!array) {
			APP.data[blockIndex][name] = $(this).val();
		} else {
			switch(array) {
			    case "stages":
			        APP.data[blockIndex].stages[stagesIndex][name] = $(this).val();
			        break;
			    case "checkpoints":
			        APP.data[blockIndex].stages[stagesIndex].checkpoints[fieldTypeIndex][name] = $(this).val();
			        break;
			    case "instances":
			        APP.data[blockIndex].stages[stagesIndex].checkpoints[fieldTypeIndex].instances[subitemIndex][name] = $(this).val();
			        break;
					case "criteria":
			        APP.data[blockIndex].stages[stagesIndex].checkpoints[fieldTypeIndex].criteria[subitemIndex2][name] = $(this).val();
			        break;
			}
		}
		updateData();
	});

	$(document).on("click", "[func]", function() {
		var func = $(this).attr("func");
		var blockIndex = $(this).closest("[name=block]").attr("index");
		var stagesIndex = $(this).closest("[name=stages]").attr("index");
		var fieldTypeIndex = $(this).closest("[name=checkpoints]").attr("index");
		var subitemIndex = $(this).closest("[name=instances]").attr("index");
		var subitemIndex2 = $(this).closest("[name=criteria]").attr("index");
		switch(func) {
		    case "add-block":
		        APP.data.push(JSON.parse(JSON.stringify(APP.sampleData)));
		        break;
		    case "add-stages":
		        APP.data[blockIndex].stages.push(JSON.parse(JSON.stringify(APP.sampleData.stages[0])));
		        break;
		    case "add-instances":
		        APP.data[blockIndex].stages[stagesIndex].checkpoints[fieldTypeIndex].instances.push(JSON.parse(JSON.stringify(APP.sampleData.stages[0].checkpoints[0].instances[0])));
		        break;
				case "add-criteria":
		        APP.data[blockIndex].stages[stagesIndex].checkpoints[fieldTypeIndex].criteria.push(JSON.parse(JSON.stringify(APP.sampleData.stages[0].checkpoints[0].criteria[0])));
		        break;
		    case "add-field":
		    	var type = $(this).attr("type");
		    	var field = JSON.parse(JSON.stringify(APP.sampleData.stages[0].checkpoints[0]));
		    	field.type = type;
		        APP.data[blockIndex].stages[stagesIndex].checkpoints.push(field);
		        break;



		}
		console.log(APP.data);
		render();
	});

	function render() {
		var mainTemplate = $(".sample-template").clone();
		var blocks = $(".block-form").find("[name=blocks]").html("");

		for (var i = 0; i < APP.data.length; i++) {
			var block = APP.data[i];
			block.id = "b" + (i+1);
			var $block = mainTemplate.find("[name=block]").clone();
			$block.attr("index", i).addClass(APP.data.length > 1 && i < APP.data.length - 1 ? "hide-btn" : "");
			$block.find(".panel").remove();

			$block.find("[name=blocktitle]").val(block.blocktitle);
			$block.find("[name=id]").val(block.id);

			for (var j = 0; j < block.stages.length; j++) {
				var stages = block.stages[j];
				stages.id = "s" + (j+1);
				var $stages = mainTemplate.find("[name=stages]").clone();
				$stages.attr("index", j).addClass(block.stages.length > 1 && j < block.stages.length - 1 ? "hide-btn" : "");
				$stages.find(".panel").remove();

				$stages.find("[name=id]").val(stages.id);
				$stages.find("[name=title]").val(stages.title);
				$stages.find("[name=img]").val(stages.img);

				for (var k = 0; k < stages.checkpoints.length; k++) {
					var checkpoints = stages.checkpoints[k];
					checkpoints.id = "cp" + (k+1);

					var $checkpoints = mainTemplate.find("[name=checkpoints]").clone();
					$checkpoints.attr("index", k).addClass(stages.checkpoints.length > 1 && k < stages.checkpoints.length - 1 ? "hide-btn" : "");
					$checkpoints.find(".panel").remove();

					$checkpoints.find("[name=requiredCP]").val(checkpoints.requiredCP);
					$checkpoints.find("[name=id]").val(checkpoints.id);
					$checkpoints.find("[name=title]").val(checkpoints.title);
					$checkpoints.find("[name=description]").val(checkpoints.description);
					$checkpoints.find("[name=url]").val(checkpoints.url);
					$checkpoints.find("[name=urlText]").val(checkpoints.urlText);
					$checkpoints.find("[name=type]").val(checkpoints.type);
					$checkpoints.find("[name=routeFileName]").val(checkpoints.routeFileName);



					for (var l = 0; l < checkpoints.instances.length; l++) {
						var instances = checkpoints.instances[l];
						instances.id = "i" + (l+1);
						var $instances = mainTemplate.find("[name=instances]").clone();
						$instances.attr("index", l).addClass(checkpoints.instances.length > 1 && l < checkpoints.instances.length - 1 ? "hide-btn" : "");
						$instances.find(".panel").remove();

						// $instances.find("[name='disableChecked']").val(instances["disableChecked"]);
						$instances.find("[name=id]").val(instances.id);
						$instances.find("[name='prompt']").val(instances["prompt"]);
						$instances.find("[name='placeholder']").val(instances["placeholder"]);

						$checkpoints.find("> .panel-body").append($instances);
					}


					for (var l = 0; l < checkpoints.criteria.length; l++) {
					  var criteria = checkpoints.criteria[l];
					  criteria.id = "c" + (l+1);
					  var $criteria = mainTemplate.find("[name=criteria]").clone();
					  $criteria.attr("index", l).addClass(checkpoints.criteria.length > 1 && l < checkpoints.criteria.length - 1 ? "hide-btn" : "");
					  $criteria.find(".panel").remove();

					  // $criteria.find("[name='disableChecked']").val(criteria["disableChecked"]);
					  $criteria.find("[name=id]").val(criteria.id);
					  $criteria.find("[name='key']").val(criteria["key"]);
					  $criteria.find("[name='value']").val(criteria["value"]);

					  $checkpoints.find("> .panel-body").append($criteria);
					}


					$stages.find("> .panel-body").append($checkpoints);
				}

				$block.find("> .panel-body").append($stages);
			}

			blocks.append($block);

		}

	}

	function updateData() {
		var blocks = $(".block-form").find("[name=blocks]");
		for (var i = 0; i < APP.data.length; i++) {
			var block = APP.data[i];
			var $block = blocks.find("[name=block][index=" + i + "]");


			for (var j = 0; j < block.stages.length; j++) {
				var stages = block.stages[j];
				var $stages = $block.find("[name=stages][index=" + j + "]");

				$stages.find("[name=title]").val(stages.title);
				$stages.find("[name=img]").val(stages.img);



				for (var k = 0; k < stages.checkpoints.length; k++) {
					var checkpoints = stages.checkpoints[k];
					var $checkpoints = $stages.find("[name=checkpoints][index=" + k + "]");

					$checkpoints.find("[name=requiredCP]").val(checkpoints.requiredCP);
					$checkpoints.find("[name=id]").val(checkpoints.id);
					$checkpoints.find("[name=title]").val(checkpoints.title);
					$checkpoints.find("[name=description]").val(checkpoints.description);
					$checkpoints.find("[name=url]").val(checkpoints.url);
					$checkpoints.find("[name=urlText]").val(checkpoints.urlText);
					$checkpoints.find("[name=type]").val(checkpoints.type);
					$checkpoints.find("[name=routeFileName]").val(checkpoints.routeFileName);


					var checkpointVal = $checkpoints.find("[name=type]").val(checkpoints.type);

					console.log("checkpoints val:",checkpointVal);
					// $checkpoints.find("[name=type]").val(checkpoints.disableChecked);

					for (var l = 0; l < checkpoints.instances.length; l++) {
						var instances = checkpoints.instances[l];
						var $instances = $checkpoints.find("[name=instances][index=" + l + "]");
						console.log("instances:", $instances );

						$instances.find("[name=id]").val(instances.id);
						$instances.find("[name='prompt']").val(instances["prompt"]);
						$instances.find("[name='placeholder']").val(instances["placeholder"]);
					}

					for (var l = 0; l < checkpoints.criteria.length; l++) {
					  var criteria = checkpoints.criteria[l];
					  var $criteria = $checkpoints.find("[name=criteria][index=" + l + "]");
					  console.log("criteria:", $criteria );

					  $criteria.find("[name=id]").val(criteria.id);
					  $criteria.find("[name='key']").val(criteria["key"]);
					  $criteria.find("[name='value']").val(criteria["value"]);
					}
				}
			}
		};
	}
});
