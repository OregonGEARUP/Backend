var APP = {};
APP.data = [];
APP.sampleData = {
	"date": "",
	"id": "",
	"stages": [{
		"title": "",
		"id": "",
		"img": "",
		"checkpoints": [{
			"title": "",
			"description": "",
			"moreInfo": "",
			"type": "",
			"instances": [{
				"prompt": "",
				"placeholder": ""
			}]
		}]
	}]
};


$(document).ready(function() {

	$(document).on("click", "#addBtn", function() {
		 $("[func='add-block']").click();
	});

	$(document).on("click", "#dldBtn", function() {
    	var json_file="";
    	filename = $("#fileName").val();
    	if(filename==""){
    		alert("Input your filename first");
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
			block.id = "block_" + (i+1);
			var $block = mainTemplate.find("[name=block]").clone();
			$block.attr("index", i).addClass(APP.data.length > 1 && i < APP.data.length - 1 ? "hide-btn" : "");
			$block.find(".panel").remove();

			$block.find("[name=date]").val(block.date);
			$block.find("[name=id]").val(block.id);

			for (var j = 0; j < block.stages.length; j++) {
				var stages = block.stages[j];
				stages.id = "Stage_" + (j+1);
				var $stages = mainTemplate.find("[name=stages]").clone();
				$stages.attr("index", j).addClass(block.stages.length > 1 && j < block.stages.length - 1 ? "hide-btn" : "");
				$stages.find(".panel").remove();

				$stages.find("[name=title]").val(stages.title);
				$stages.find("[name=id]").val(stages.id);
				$stages.find("[name=img]").val(stages.img);

				for (var k = 0; k < stages.checkpoints.length; k++) {
					var checkpoints = stages.checkpoints[k];
					var $checkpoints = mainTemplate.find("[name=checkpoints]").clone();
					$checkpoints.attr("index", k).addClass(stages.checkpoints.length > 1 && k < stages.checkpoints.length - 1 ? "hide-btn" : "");
					$checkpoints.find(".panel").remove();

					$checkpoints.find("[name=title]").val(checkpoints.title);
					$checkpoints.find("[name=description]").val(checkpoints.description);
					$checkpoints.find("[name=moreInfo]").val(checkpoints.moreInfo);
					$checkpoints.find("[name=type]").val(checkpoints.type);

					for (var l = 0; l < checkpoints.instances.length; l++) {
						var instances = checkpoints.instances[l];
						var $instances = mainTemplate.find("[name=instances]").clone();
						$instances.attr("index", l).addClass(checkpoints.instances.length > 1 && l < checkpoints.instances.length - 1 ? "hide-btn" : "");
						$instances.find(".panel").remove();

						$instances.find("[name='prompt']").val(instances["prompt"]);
						$instances.find("[name='placeholder']").val(instances["placeholder"]);

						$checkpoints.find("> .panel-body").append($instances);
					}

					$stages.find("> .panel-body").append($checkpoints);
				}

				$block.find("> .panel-body").append($stages);
			}

			blocks.append($block);
			$block.find("[name=date]").datetimepicker({
				format: "MM/DD/YYYY",
                defaultDate: moment()
            });
		}

	}

	function updateData() {
		var blocks = $(".block-form").find("[name=blocks]");
		for (var i = 0; i < APP.data.length; i++) {
			var block = APP.data[i];
			var $block = blocks.find("[name=block][index=" + i + "]");

			$block.find("[name=date]").val(block.date);

			for (var j = 0; j < block.stages.length; j++) {
				var stages = block.stages[j];
				var $stages = $block.find("[name=stages][index=" + j + "]");

				$stages.find("[name=title]").val(stages.title);
				$stages.find("[name=img]").val(stages.img);

				for (var k = 0; k < stages.checkpoints.length; k++) {
					var checkpoints = stages.checkpoints[k];
					var $checkpoints = $stages.find("[name=checkpoints][index=" + k + "]");

					$checkpoints.find("[name=title]").val(checkpoints.title);
					$checkpoints.find("[name=description]").val(checkpoints.description);
					$checkpoints.find("[name=moreInfo]").val(checkpoints.moreInfo);
					$checkpoints.find("[name=type]").val(checkpoints.type);

					for (var l = 0; l < checkpoints.instances.length; l++) {
						var instances = checkpoints.instances[l];
						var $instances = $checkpoints.find("[name=instances][index=" + l + "]");

						$instances.find("[name='prompt']").val(instances["prompt"]);
						$instances.find("[name='placeholder']").val(instances["placeholder"]);
					}
				}
			}
		};
	}
});
