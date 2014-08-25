var app = angular.module('taskManager', []);

app.factory('taskList', function ($http) {
	return {
		list: function (callback) {
			$http.get('tasks.json')
			.success(callback)
		}
	}
});

app.controller('TaskCtrl', function($scope, $http, taskList) {
	taskList.list(function (cols) {
		$scope.cols = cols;
	})

	$scope.changeCol = function (col, colName) {
		col.changing = false;
		col.name = colName;
		var colKey = $scope.cols.indexOf(col);

		$http({method: 'POST', url: '/change_col', data: {colKey:colKey, newName:colName}})
        .error(function() {
            alert('error while connection to server');
        });
	}

	$scope.addTask = function (form) {
		var newTask = {text:$scope.newTask}
		$scope.cols[0].tasks.push(newTask);
		$scope.newTask = "";

		$http({method: 'POST', url: '/add_task', data: newTask})
        .error(function() {
            alert('error while connection to server');
        });

	};

	$scope.changeTask = function (task, keyCol, keyTask,  newText, newTextCol) {
		if(newTextCol) {
			$scope.cols[keyCol].tasks.splice(keyTask, 1);
			$scope.cols[newTextCol-1].tasks.push({text:newText, changing:false});
		}
		else {
			task.changing = false; 
			task.text = newText;
		}

		$scope.refreshDB();
	}

	$scope.removeTask = function (task) {
		var removeIndex;
		var removeCol;
		for(var i = 0, len = $scope.cols.length; i<len; i++) {
			if($scope.cols[i].tasks.indexOf(task)!=-1) {
				removeIndex = $scope.cols[i].tasks.indexOf(task);
				removeCol = i;
				$scope.cols[i].tasks.splice(removeIndex, 1);
				break;
			}
		}
		
		$http({method: 'POST', url: '/remove_task', data: {removeIndex:removeIndex, removeCol:removeCol}})
        .error(function() {
            alert('error while connection to server');
        });

	}

	$scope.refreshDB = function () {
		$http({method: 'POST', url: '/edit', data: $scope.cols})
        .error(function(data, status, headers, config) {
            alert('error while connection to server');
        });
	}

});

app.directive('draggable', function() {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			element.draggable({
				revert:true
			});
		}
	};
});

app.directive('droppable', function() {
	return {
		restrict: 'A',
		link: function(scope,element,attrs){

			element.droppable({
				drop:function(event,ui) {

					var dragEl = angular.element(ui.draggable),
						dropEl = angular.element(this);

					var colnum = dragEl.find('.task_interface').attr('colnum');
					var tasknum = dragEl.find('.task_interface').attr('tasknum');
					scope.cols[colnum].tasks.splice(tasknum, 1);

					var oldText = dragEl.find('.task_text').text();
					var newColnum = dropEl.attr('colnum');
					scope.cols[newColnum].tasks.push({text:oldText, changing:false});
					
					scope.$apply();
					scope.refreshDB();
				}
			});
		}
	};
}); 
