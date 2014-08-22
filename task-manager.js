var app = angular.module('taskManager', []);


app.controller('TaskCtrl', function($scope) {
	
	$scope.cols = [{
		id: 1,
		name: "Не начатые",
		tasks: [
			{text:"Захватить Бельгию"},
			{text:"Открыть Бозон Хиггса"}
		]
	},
	{
		id:2,
		name: "В процессе",
		tasks: [
			{text:"Устроиться к ракунс-груп"},
			{text:"Разобраться в ангуляре"},
			{text:"Повторить регулярки"}
		]
	},
	{
		id:3,
		name: "Деплой",
		tasks: [
			{text:"Забрать зарплату"}
		]
	},
	{
		id:4,
		name: "Завершенные",
		tasks: [
			{text:"Окончить вуз"},
			{text:"Бросить первую работу"},
			{text:"Бросить вторую работу"}
		]
	}];

	$scope.addTask = function () {
		if($scope.newtask) {
			$scope.cols[0].tasks.push({text:$scope.newtask});
			$scope.newtask = "";
		}
	};

	$scope.openSettings = function () {
		console.log('ha');
	}

	$scope.changeColName = function (index) {
		console.log(index);
	}

	$scope.changeTask = function (key_col, key_task,  new_text, new_text_col) {
		if(new_text_col) {
			$scope.cols[key_col].tasks.splice(key_task, 1);
			$scope.cols[new_text_col-1].tasks.push({text:new_text});
		}
	}
});

app.directive('draggable', function() {
	return {
		// A = attribute, E = Element, C = Class and M = HTML Comment
		restrict:'A',
		//The link function is responsible for registering DOM listeners as well as updating the DOM.
		link: function(scope, element, attrs) {
			element.draggable({
				revert:true
			});
		}
	};
});

app.directive('droppable', function($compile) {
	return {
		link: function(scope,element,attrs){

			element.droppable({
				drop:function(event,ui) {

					var dragEl = angular.element(ui.draggable),
						dropEl = angular.element(this);

					var colnum = dragEl.find('.task_interface').attr('colnum');
					var tasknum = dragEl.find('.task_interface').attr('tasknum');
					scope.cols[colnum].tasks.splice(tasknum, 1);

					var old_text = dragEl.find('.task__text').text();
					var new_colnum = dropEl.attr('colnum');
					scope.cols[new_colnum].tasks.push({text:old_text});
					
					scope.$apply();
				}
			});
		}
	};
}); 
