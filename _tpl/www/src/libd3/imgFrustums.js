(function(){
IX.ns('IXW.LibD3');
var nsD3 = IXW.LibD3;

var d3BubbleFactory = nsD3.bubbleFactory;
function registerBubbleWorker(svg, model, h, cbFn){
	setTimeout(function(){
		var workerId = IX.id();
		d3BubbleFactory.register(workerId, svg, model.getArea(), h, model.getDesity());
		if(IX.isFn(cbFn)) cbFn(workerId);
	}, 1000);
}
function enableBubbleWorker(workerId, isEnabled){
	d3BubbleFactory.enableWorker(workerId, isEnabled);
}

function DefPolygonSchemes(){
	var PolygonSchemeNamePrefix = "image-cube4";
	var blueBot =    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAYCAYAAACIhL/AAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkRENzAwM0ZFMkM4NjExRTZBQ0NBQURFOUE2QkU5NDlEIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkRENzAwM0ZGMkM4NjExRTZBQ0NBQURFOUE2QkU5NDlEIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6REQ3MDAzRkMyQzg2MTFFNkFDQ0FBREU5QTZCRTk0OUQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6REQ3MDAzRkQyQzg2MTFFNkFDQ0FBREU5QTZCRTk0OUQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7wuRw8AAAEPUlEQVR42ryXy28cRRCHax67O/t0opBgFA6RRXCiRFiJAcGJAycO/MFcEa8DKIAJCihREhFsAiR2PDvv7hm+2pmVVtbuYsdrt1Qa7Xim5+tfVf267Qy+qWQF4zqxRTwgfiXK474Yfrz87/4pwS4RH7qODMQRI5XcYLkbVSXfc393FSt/XcCAuOO5chm4yHNk1wEQMK+spGMreZ/rqwY0Ok9Ah9gE6jpwie/K85YrEdccSEteXWOlnZcSmVIGgH5alvKUd34h7FkDXkGlu4A4AL0ELOz4End9SYmC+5Nijo204kLSzEqcW0mMyDpqXiV2+PMfZwHYa9J5CYhXDVgU+JIMWpL1W2IIy/2qKMUJCrE9gMNc8sRKlhlJuD9E0S0g3yHtPzDf4SoAXeIm6dwALka1vzqehAoGQAZcMeqIUbC2V4e+BGwZFRPgEjWLiPQjYzZRswb9BNA/efSn46R9EeA66byjaQPsBR8PgYt7LUlVHVVt2BY7CzYdze8SwKJnxKK2jXIpSHtG2hMFRdE3gPyM0Np8srToj/hgn9hGsQvAHShYW8GoNYAy1LOaTlXpKNi8AYyjQbo9VPXHhbRRtZsb6eW1mmtAppp2/PBgGaCm8zaq3VIwVr/Pyg8BimfTeVyweaAAuoQHbItrJ1VQK33UHGnqAd3j0R8BLY4CXuX6ETGi3vZbnvwbeLLfbUk0aktCFIvSeVJIDerRDVGTtGu3B6RdQYeArmFLQVWn/dF0h/Gb8OSMx3SBGthSGXrUpi8m1Po0YlwairRfRM0PgNwcfivfAflS4dRInxHvIc8N3HaQixin8TWk15UbTbH+PI2KM00kmpXpPQze4TueKlg6EnN9k9ufA7kz7WJ9+B7kDw3bFDNcLjFcVtMGLk79Sedlah8XAD1tunWoZzK3S4o9dh8fYXyFhEGZdO5HevBwFpxm3kbBLRrGYDOHwIzVZmiSpE9NdknP69Tl0a7WXYdrFzPv53WzXARU59P0/rPMB5+xkl3UvM2qriF5j5cPWfU4tZMdJD1J2mcbhMbwsBsFmzQIoXYzAizgW7/x+O/AVYt8cN7oo+Y2Hb6mW13jjRH2kxzHG2ctpvHCTlLgg1Z6ajEsfgicqnUPsOz/jHrZeKvZXcom7Ut3l3kmjYJBk06FUjjTmPSLVZxm9pjsOWm/SSo2mLyLAqGGbmGE7rcFwJYFVBixy2HBU78DTI1ZVRuaWrEOc+jp++GqT9R6lL/P5I9LK3e5rmvtFFbGfDwCJO3gawCW1JVLvbZ1xyjqdA5ZlNbaXnNQyM/yRB0TX/GxK/iWgvZRJgRynLiScapFbHEBC0zdYLrnZtz8kvcOzuPIPx1/89EvgNgE4F01eZoppVZtc/zvES5xn2cfn+f/JLNDu+wBEE+IbeCuNaXgVnWd/ay+fN7/NM0bKfF1VXvZJrFzkpPzovGfAAMAcIS8vBuuD64AAAAASUVORK5CYII=";
	var blueSide =   "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAADICAYAAAADQnpaAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjQ2Rjg2NTgxMkQxRDExRTZCOERBQTg4RjZGOTBEQkE0IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjQ2Rjg2NTgyMkQxRDExRTZCOERBQTg4RjZGOTBEQkE0Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NDZGODY1N0YyRDFEMTFFNkI4REFBODhGNkY5MERCQTQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NDZGODY1ODAyRDFEMTFFNkI4REFBODhGNkY5MERCQTQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7+h+wBAAADyElEQVR42uyabW7bMAyGSVlZURQ7xi65c+4iw9ANbWpxpkRJtJFfIvOPHlhvRvP4Nb9EecEfv+gnHAcCfG0JPo7zDosHAWx7gZfjnPnf7UeC91uCP4f9Swhfq/BCkO8FXg/7/lXgLbNiBr9m+P2ywd8bwn0Vfie4fezwyfL4CTK7ghUz+C3D+3Fehh/gG58P1d/uB5eV7+wKVszg4wk+wXB87nBnXuXCE4+ABzzgAQ94wAMe8IAHPOABD3jAAx7wgAc84AEPeMADHvCABzzgAQ94wAMe8IAHPOABD3jAAx7wZ8P5C6jIRocVarYK48+S8Njqt1tJ4N1W4VdGJr5IzYqYQflgkcCTWL3jTutxUMorM8t1V7eAcgsWqN9RRrYvQ0A7o8iNRraAk3LNy4TTR0dAqhkCmkYMUSmn83n1OOc50SyeI1MwWXyuWMxtysU1Xm6pRFZeYKrmSCdrtnT1NVtYNVa1TT2YiqhxsKnPQBNM/bFW4fPzyNysK7OILfv8Uukjz4syA7x+fuQ5Sdp0syi/snpAsd8VPZRjS+9cl7petl4BbUlSAzoCwWd0CKicgd2SoOU533Wj+jvLeb4BCA9ZeQ+kmEm56is1oFxN4ufRLo0V2lNRlEu2JDKWP408n6moVVuVd/UgRZR2Ub1jS0dTnjOHGqcqR0n6/hSWlWjwam9R66fZ58IZc0sfYkD7yyNblHLsfQWtyuf0lvrqn0D1BONI3q0VkVbtobz0Ihq9QHpL+x2H3iLL3HWudpnPSXYWGymzKlecLY8xjnxSsVY4ygL9oK+Ye0vnZL0T8IQTzK445kVzhSpefqDaS/nZLeDtFpzADYypqBi10qtyvOwIPHZzfVY8DTJyZ5tbsO9DpXiQRn8ha1cceX5quc3Ir+XCHP494HRaLFp73FSkwSFbtjbOiVvU+OyhPI3GpVLQw+eDNZSDr89Pyp+RLaIc29bOTbleLJ6mvPZxmiu2WTnO/T+XPw5rPWYd3gSeXubU/B7NC+3K+SZ9KHp+b/HMc3g4iHorf3oqyvsRXUzrmxaYW6AxzqHDIHp9P5kvK38xwjWrrqFcoTCSnxyUt6jNTW7fAJjWIRwb3HTyOTjMLde3q/myCln/DyPp1ShfLnjAcS4WqILp6RZse6JrhYJfhU6lbsr73x81LvBsXO6pOFeiBxed8rwFFJ3zHNUgqt8S2ZRfW656HHByyzhntWXZZA1ah7fpYeu7FXbLRgkylormlltMXVF4fM518Ee41cvl+IMGOHshVVLldp9nSoK3TVyoxkL4L8AANCL6Le5I0YUAAAAASUVORK5CYII=";
	var blueTop =    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAYCAYAAACIhL/AAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkRGQUMzODkyMkM4NjExRTZBRjk5OUQyMDNENzlENTUwIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkRGQUMzODkzMkM4NjExRTZBRjk5OUQyMDNENzlENTUwIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6REZBQzM4OTAyQzg2MTFFNkFGOTk5RDIwM0Q3OUQ1NTAiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6REZBQzM4OTEyQzg2MTFFNkFGOTk5RDIwM0Q3OUQ1NTAiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz52juE2AAAECUlEQVR42ryXa2tUVxSG17nPTJLiBVrRqmCroC2hqaaKgk2DSn+CIP13/QklHwpVSOxFrBdMNK0o7QdFhEhkOpmZc9n79FlnzqRjyFxMJ9mwmDk5e8559vvutdaOc3IllzGMaeIScZ/4nTCj/vDpZ4Pv+/8T7JAjctV15CBhWOoFY+VzPm9y769xrHyngDXALgeunPBdaRGvFdDm4gEYpla+JV6VoPW9BIRLZgA6F7qShp6shR3A1FNAETc1EiZWmomRfUDeIB7xmztEttuAR1BpHqAKYP9ErjQjX1pcJ4EnGfdsnouTeuID145dwsgEcRrIU/i/xDOe7QbgJLJ9jZ3HAGsA9EbBKp60uU4DRzLubSaFj5JcZ6iaAZ74mcQKCuQV1J1G5VtMWx8HoEuc42VfBKWdkSfNEiwBNNMofHckR8G8+z3IxWC59S2QDotwC8h24sgU9l8H9glTfx7F9n6Ax3nBHA8OCzs92QCsVYChmqpE2F6wzVVxjUoSdlQ0WVdNFontsa+gVj5lG5zE9ttM/WPgpt9SB6ewc56HHVY7I7UUxVS1SO3q2Ge2A9tukNWO7sssJ3lssTeD2EoUZ1JV2wGdxPZ1FnSTerg2CNAjvgLuvKpF1Ct+j2qlnaOC9QMF0gMwSLugRmrATgJa496fTL0NaLIV8ASf14gDqFMHar3qS51oAhlrOeln504gUcvJFFQhTQFZKUCNTOkCsF335kq3w2giBGPoKEOHLs5zxWryqBsIEE8E0iQatUDqxLpuI+6rWN+deiwf9VqsgBehPVvuvbFaPGxvol7YzGSilclUO5P9WL5PpxG/dpXTdF/kL8tMnucBHyJ1gBVBZKWVeRKbHSTJCKAu73F5j2+xl2s/7+SDPnuZuOv0Oc18gtTaa70yk7X+tfgeE6l2jZ3sy17lCC8p9yGq1dqGZDFFnWwz9Uf24MtBdfA5K/vbGDnP5zQ2VImG9lg+3ynUttxf75MgidqakSB2M0Em1Wru/cb0h8Dl/ergduMDyo8W7SPd2hj9p+ZQ23tLTJp3amFbM7dTCxVM2+BzfrgEWGtYoR40ertLY1h32WonQHrKCdVOVa0o0rjCvJ8Aez1qJxlaLYjZsj8nJeg7/VnbG5NyBdMk0HqHaiGqVUswVUwTQ49gy+M+UeuWu8MLHvOCOeIo0aAzbOgJJ9JeW5aj0tYiCYCqoqCCaXt7qh2DiHfzRN1A9x942cco9Q0HgoO8fCPxisNrolmup2s9vGqClT33Latb4Ldre3Hk744XgHyPfV8COqsKsU9jp3N41b1XQWFLJVhk7upe/k/SO3QT3wNklWo/x/47Ix2L9cY97v1CJHv9T9N2o0ksYOMDyGa0Tb3Pybnf+FeAAQAen3aADhkzswAAAABJRU5ErkJggg==";
	var yellowBot =  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAYCAYAAACIhL/AAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkRDMzZDMDhBMkM4NjExRTY5MjhDRDYyQzdGQjI0MkMxIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkRDMzZDMDhCMkM4NjExRTY5MjhDRDYyQzdGQjI0MkMxIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6REMzNkMwODgyQzg2MTFFNjkyOENENjJDN0ZCMjQyQzEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6REMzNkMwODkyQzg2MTFFNjkyOENENjJDN0ZCMjQyQzEiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5p2u8cAAAEcklEQVR42ryXS28cRRDHa2Z2dmZftoWTYBQOUSA4ERGR44C4ceAEEp8mXwM+DgdOSJHgBOJhghKUKEEEm4Ahjndn59HT0/yqvSutLduyHdstleaxPT2/qX9VdW3gPu/LKYxr2C3sAfYr1hz5ybvDQ39uvSLYIvaBBKF+ZY1dF+euirjvOF8/jS8/KWCKrUgYXQQukyBalyCogYvENYk09g7HlxPQ7DwBA2wZqGvA5RK2nksYZxwrri1QoTR1W2yVcewD+jH3fueZXzB71oB4K1jFWwFA/0kUDyVKxhJ3CsyIRM7jm3GMFVKXY0BzQJeAvIyt8esfZwHYwW4DtoiXXk7AMonTXNr9UuJejVnuO7EmkFZqJe4aKYeV1HkJKJBmAOgtaZq3kf171ts+DcAQu4GcbwE2xmt/SSsBTsG6gPWNJHO1B4vaO6aj3WukyizSN1KPDeeVGEDVm0GtoB/hzT+Z+dNRZD8IcAk5V/CaA2yTlw+BQ85uIS28k+C19sDuApsOvW5TZqLYSN1lToJlBtmBxJu1ym4uAPkJprH59NCg31MHe5jG2QJe2/JgUVvBxpIMyh35kFO9tBdsv2GrwFs1jPBkS6pRG9AO97qYenMe2Qsv+93h1mGAKudNLt/1YGH8Ao9tAzTeJedRwfYDrbJQTAboMOY8kbpQ0B5xOwfoAG9uMPNHQM1ewMscP8TmiLcXSLMJGICdTNK5HDBzoJzHhVSr85AEwpuZZnuK7B1kx5tmXpxNqaUq++PpDhNO4jCUsx4+NvuNJPNWepcq6V0opLs44uO3KVOq2CbxTtEP3mf2p/LF4LVpkmghfYa9B/11imufL6rVuUJ04PrAX3uJpXklL05BfbYPZjKYd7gm4t2pBM0YT77Ozc+AXJtmsU7+AZpHxMMdjhelbuLJrkCSFJp5JTFkJV2oX1lu/0ajHx4icSS2bgHV8pDOKZPzMtN47C0zKvzXfMmbTKaw2i6Q29iIhQDt5QCHSGJPFJezWV2S1fVYE4ZkKUmWimSxC7xXk+RLYvCfw+rgM75kXVx9kweu8HUTUDMi+0icfnEs2WcTpBpHYkYKlrLLKJyWmzkvr2seMvs34NxRdhLt6X7mocdi3SrHJRZiq6uHvhmYlf2w2jhbYoyvhQk7S3enFlJinAXQqrfuAVaeZC+mXXL3WOQNAngF0Knswx3Z2V1MYcQWu3eXvXIaLdJ5OpFToRROW7RvAfv3NLqZDRZ7juw3gLzK4h08OPTmG4KSxqCiZrK9BS0AC7yWR77e1bkW5q6vd073Y5uwhnbfj067o1bZ77P4E7F4s1HZiZ2I2FTZTV5ImRiJWg2ZGQLV9jtGY1RO4KzG2sakUajOsqMeY9/wwktA3ga4tyN5NZKIzkVrqHM0ryblfney55Y+VES2zqPln46/AfkK2ZaBfMcXeRsW7AZ20v53fZftmvvMfXKe/0lmh/P/5lzzFFvFe1forBvusn26B74S0Gef95+m/UbhZRf3ELhlzteO0zkfNP4XYADemNiahV2yVQAAAABJRU5ErkJggg==";
	var yellowSide = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAADICAYAAAADQnpaAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjY5NDAwQkY4MkQxRDExRTZBNkQ0RDA0RUU0QTFDQ0JBIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjY5NDAwQkY5MkQxRDExRTZBNkQ0RDA0RUU0QTFDQ0JBIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6Njk0MDBCRjYyRDFEMTFFNkE2RDREMDRFRTRBMUNDQkEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6Njk0MDBCRjcyRDFEMTFFNkE2RDREMDRFRTRBMUNDQkEiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5JWrrXAAADlklEQVR42uyc3W7bMAyFSVlZUBR7jL3k3mcPOAzbkCYWJ4mURKfbjcnuii6Yv8KfmKNDynaTIn378hX6hg+A7Vbvdzi90QawX+t9bs8yv5h/Alx+1PgNmB7n2aXy7i81PgM8XjNn3MAv3wGvv+rj+2k43i9Atzd+sl8zS9EybuDX+g6u5+FwuwC2d/D4VLO/5a5xl6JlXMH48nZelnbzdu88wj3BB24BD3jAAx7wgAc84AEPeMADHvCABzzgAQ94wAMe8IAHPOABD3jAAx7wgAc84AEPeMADHvCABzzgAQ94wO1b+6A1clCNInF2K8JhJn+Km0heHHFyoyMj8weYRxSJ05mD5jV4kuARyfL56Jl5Z+apN5X6QgsLXBhIojnJ26DiJEt5lgVEmpG9JfPFG7KkGWSAo+KwFbve7G/aaySDz+v+WJhXdddF5CnLKCKdtUPmI/vKzHWMChyjkTFzxcFuxTqzJAOMMMFlgMrNh55CMhmWxoWLxz7HslVo+15KDTRUUdu/chqPfU7czXrWZMxccbBVqLfmnTE0bxrhaDh76oOdrtBdONy8sowkM2zMnNiCrIZuubM60d5yYbRc1mlbUYoh88URt/SZdVlDx/7Cy733csYShtViMlrmXKGqB5dkO5YpSfOknx/C4pbFmeX/Pntj46J/LHMmWd4vc2lNagv+mpfJimuBJlU8aCwivVQ2ODcuCY/MF2+4JamOZustg3N0y/C4hyzLLcMhm8R5WRYjjQrljji1QpsstDojZ47TJQ6Zo/BAWxGcrEjaiqTWT7C7ZUU74sKPmdDKFVlQ9xWPIy5d/gfw5tcVZaXuFuTHhvKfbWSUfz+W1plbNNcc1OdEm02SMaG88q9lrk6tPq02wBVnrf7D45tJlL7/PGobRaR7OhgnVBfRMr6T5iuy0trJLes6Qn4qIC/4cAs6VeeUZXbYvCwETlZcjNxNjyjmN12yWEWEfJ/l/AX9rDjOsVb5D/v4ZM73Kf9Fby/N+7n/sxXBpSviPLSA5+ZlzJxU4zpqjsbM5zoqbmmn6NM1houWg8G8D878uEg4ag76GperW1BdnZNsPTSfF4zfa07Omk+YZ4WC1ty/Qv8DnMB/o/k3i8R9xTPz3qcOx4roBMclC/amy7fJqFHiViu8BqcMiQpsyMsUGlajBt7qT6L2H2hy7uNscJFf7RVNhsyxwzfoXNY8tyfUBimmBXqIm3ju/ggwANlGGJWcdy9LAAAAAElFTkSuQmCC";
	var yellowTop =  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAYCAYAAACIhL/AAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkRFOTRGQzE5MkM4NjExRTY4QjA5RDJBMzAwNDBBQzJCIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkRFOTRGQzFBMkM4NjExRTY4QjA5RDJBMzAwNDBBQzJCIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6REU5NEZDMTcyQzg2MTFFNjhCMDlEMkEzMDA0MEFDMkIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6REU5NEZDMTgyQzg2MTFFNjhCMDlEMkEzMDA0MEFDMkIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4nlPaXAAAEFklEQVR42ryX3YsbVRiH3zMfySZxobWgYsVC1YIixWprRcGun3jtlSD+d97qnV4ItmDrR9Gq1Gq1WPRCkcLKyppNMmfmnOPznpm02WXzsWt2B15mMpnJPPP7vR8nJnzwhCxhO028RHxLfEO4he98+9bMr7P/CfaQiHlDTHJMJAEqvCDBPc3+It/9tow33y9gF7CXxeQnJcmGYrI7QDoJPgWwJaF8S3z5VwO6eZiAhjgD0FlJWiWxTgyBLEVSFPQJYC3xdiDGHuH4XWCvc89VojpowOPY+CpAK8S/krYHBOq1rKQ5D0+8hGAAysTZkfhCoyeueBLQU6TlZX7j14MA7CHcBUnyE4D1ib8lASxbGUUVDXAmv1cUIXPxXMgqcblF3QLIHpCvExSTv8RVG8sATIiz2HkGEBvtVNUSwNL4GbBWbZsxgRwMNaAeAxxSz72V+FxfooiKOruK/e+g8k9c+fkitk8DPCEmXeOHW4BsArYF2LABI/dQSTK/DexulupnzwHwGdf5qoqgTkELQDOst48DS39zV7jw55lJv6MPrnKKPMsfjnam7T4qjaKdpm0jmKqzG9huW/Am5qVUiThy09scJdtY3on56e192I7d/iL9cH0WYEo8z8fz5NcWYKi2MqlabeeiYNNAQ5kCBmSZA9nmuMseSNvlu1+48gqgdifgSfZvEvejjoJtSNph3xmgXBEtnWbnfiANe1+lgI0hVxrQ1fgCwWlu3hhPGC2EvFHwYDd9uYTCES0ezc9OIVlvIHmPVOpuStbdwD1L7qtY78mHpx6ctFiL5UV4n2tyb7kWz8vNULSkGvSkGlLlo6NYfkTqSvtyXMVa7p9x7jpyv8b+AaTOJa1yCfS8tCrEuL0XyXxQHHRAVlkck5Q44Oqm/vYPxNdmymrmMaTWWZvGSk5ag1rNdkHQLpga+8nLSeU0D8dVXY26KKfFon1yxJWfkIN/zuqDt1Hwd+I8cVqSskP0JTBjfXmvUWuvUyfmQU4WSIhg2d0CcRSI10pWq6uvuPp74MIik0TH1xdU1g0sWOPm4wT5SezF9m0tpumF1Ugrt9OA6Ri8zYWXARvOa9Sztsnp0p87XXba6SiEYFu1napabNJ9HPgUsDuLTpJ5m7alc0A+w7SxDej2+aygQZUETItA+50HzI06DZgqxnfV1VgIS15R+7i2C+WP2H6BhzwabU/KLfHtuoh07qqKqp5ODC0Cb+vR5rAz2FtxYogUB7mixprwEQ9+BPtekaQ6FiGD1dW1jWtD8Wm9eKXAajv/4dzH3Lt+GEv+8fYHD32fFvEsSp6LCZ+kKGMADJp7FEPFsaPHys3D/E+yrU6JawDeJNZY9T9Vn9PT4VrsBCL2sP807bYNCCz038X/LYypvaycp23/CTAAgW15tgsHgiAAAAAASUVORK5CYII=";
	var CubePolygon = [ //缺省立方体的底面顶点坐标
		[0,11], // point 0
		[18,0], // point 1
		[40,13],// point 2
		[22, 24]// point 3
	];
	var BaseRect = [40, 24];//底面图片宽高
	var SideRect = [23, 200]; //侧边图片宽高
	var schemes = [{
		"f-top" : blueTop,
		"f-side" : blueSide,
		"f-side-0-1" : "",
		"f-side-1-2" : "",
		"f-bot" : blueBot
	}, {
		"f-top" : yellowTop,
		"f-side" : yellowSide,
		"f-side-0-1" : "",
		"f-side-1-2" : "",		
		"f-bot" : yellowBot
	}];

	return {
		magicNumber : 1.02,
		polygon : CubePolygon,
		baseRect : BaseRect,
		sideRect : SideRect,
		getSchemeByName : function(segIdx, name){
			var arr = name.split("-"), _name = name;
			var _schemes = schemes[1-segIdx % 2];
			while(arr.length>=1){
				if (_name in _schemes) return _schemes[_name];
				arr.pop();
				 _name = arr.join("-");
			}
			return "";
		}
	};
}
var defSchemes = null;

function calcFacesTemplate(viewbox, schemes, numOfSegments){
	var schemesRect = schemes.baseRect, 
		schemesSideRect = schemes.sideRect,
		schemesMagicNumber = schemes.magicNumber;
	var getSchemeByName = schemes.getSchemeByName;	

	var ratio = viewbox[2] / schemesRect[0]; //图片到viewbox的放大比例
	var _rect = IX.map(schemesRect, function(v){return v * ratio;}); // 符合viewbox的[w,h]
	var maxH = viewbox[3] - _rect[1]; //实际可用高度
	var dx0 = viewbox[0], dy0 = viewbox[1] + maxH;//底面RECT左上坐标
		
	var polygon = IX.map(schemes.polygon, function(v){ // 图片所含多边形在viewbox中的坐标
		return [v[0] * ratio + dx0, v[1] * ratio + dy0];
	});
	var N_polygon = polygon.length;

	var baseMatrix = ["translate(", dx0, ",YPOS) scale(", ratio*schemesMagicNumber, ")"].join("");
	function getBaseFace(segIdx, isBot){
		var clz = isBot ? "f-bot" : "f-top";
		return {
			clz: clz,
			width : schemesRect[0],
			height: schemesRect[1],
			imgUrl : getSchemeByName(segIdx, clz),
			getTransMatrix : function(h0, h1){
				return baseMatrix.replace("YPOS", dy0 - (isBot ? h0 : h1));
			}
		};
	}
	function getSideFace(segIdx, idx){
		var nextIdx = (idx+1) % N_polygon;
		var faceItem = getSchemeByName(segIdx, "f-side-" + idx + "-" + nextIdx);
		if (!faceItem) return null;

		var w = schemesSideRect[0], h = schemesSideRect[1];
		var pt1 = polygon[idx], pt2 = polygon[nextIdx];
		var matrix = [(pt1[0] - pt2[0])/w, (pt1[1] - pt2[1])/w, 0, 1, pt2[0], 0];
		return {
			clz: "f-side",
			width : w,
			height: h,
			imgUrl : faceItem,
			getTransMatrix : function(h0, h1){
				matrix[3] = (h1 - h0) / h;
				matrix[5] = pt2[1] - h1;
				return "matrix(" + matrix.join(",") + ")";
			}
		};
	}

	var faces = [];
	for (idx=0; idx<numOfSegments; idx++){
		var _faces = [];
		if (idx===0)
			_faces.push(getBaseFace(idx, true));

		for (var i=0; i<N_polygon; i++){
			var face = getSideFace(idx, i);
			if (face) _faces.push(face);
		}
		_faces.push(getBaseFace(idx));
		faces.push(_faces);
	}

	return {
		polygon : polygon,
		density : _rect[0] * _rect[1] / 400,
		maxH : maxH,
		faces : faces
	};
}

function FrustumBaseModel(viewbox, options){
	var schemes = $XP(options, "schemes");
	if (!schemes){
		if (!defSchemes) 
			defSchemes = new DefPolygonSchemes();
		schemes = defSchemes;
	}
	var numOfSegments = $XP(options, "numOfSegments", 1);
	var base = calcFacesTemplate(viewbox, schemes, numOfSegments);
	var facesTpls = base.faces;

	var density = $XP(options, "density", base.density);
	var baseH = $XP(options, "baseH", 5);
	var maxH = base.maxH;
	var unitH = (maxH - numOfSegments * baseH) / options.max;

	var data = [], height = 0;
	function calcFace(face, fromH, toH){
		data.push(IX.inherit(face, {
			transform : face.getTransMatrix(fromH, toH)
		}));
	}
	function _calc(values){
		var prevH = 0, nextH = 0;
		data = [];
		IX.iterate(facesTpls, function(tpl, idx){
			nextH = Math.floor(prevH + $XP(values, idx+"", 0) * unitH + baseH);
			IX.iterate(tpl, function(face){calcFace(face, prevH, nextH);});
			prevH = nextH;
		});
		height = prevH;
	}
	_calc([]);
	return {
		getArea : function(){ return base.polygon; },
		getDesity : function(){ return density; },
		getHeight : function(){ return height; },
		getData : function(){ return data; },
		getViewbox : function(){ return viewbox; },
		setValue : function(value){
			_calc((numOfSegments === 1 && !isNaN(value)) ? [].concat(value) : value);
			return data;
		}
	};
}

function FrustumBaseView(gEl, model){
	var facesEl = gEl.selectAll("image").data(model.getData());
	facesEl.enter().append("image")
			.attr("class",  function(dd){ return dd.clz; })
			.attr("width", function(dd){ return dd.width; })
			.attr("height",  function(dd){ return dd.height; })
			.attr("xlink:href", function(dd){ return dd.imgUrl; })
			.attr("transform", function(dd){ return dd.transform; });

	return {
		setValue : function setValue(v){
			facesEl.data(model.setValue(v)).transition().duration(2000)
					.attr("transform", function(d){return d.transform;});
		}
	};
}

function FrustumView(svg, viewbox, options){
	var model = new FrustumBaseModel(viewbox, options);
	var values = options.value || [];
	var disableDefaultHover = !!options.disableDefaultHover;

	var useBubbles = $XP(options, "useBubbles");
	var workerId = null;
	var bubbleEl = useBubbles ? svg.append('g').attr("class", "bubbles") : null;

	var gEl = svg.append('g').attr("class", "prism");
	var scaleMatrix = [
		"translate(", (viewbox[0] + 0.1*viewbox[2]), ",", (viewbox[1]+0.1*viewbox[3]), ")",
		" scale(0.8,0.9) translate(-", viewbox[0], ",-", viewbox[1], ")"].join("");
	function hover(isOn){
		if (disableDefaultHover)
			return;
		var matrix = isOn ? scaleMatrix : "";
		gEl.attr("transform", matrix);
		if (bubbleEl) bubbleEl.attr("transform", matrix);
	}
	var mouseoverFn = IX.emptyFn, mouseoutFn = IX.emptyFn;
	gEl.on("mouseover", function(data){
		hover(true);
		mouseoverFn(this,data);
	}).on("mouseout", function(data){
		hover(false);
		mouseoutFn(this,data);
	});

	var view = new FrustumBaseView(gEl, model);
	view.setValue(values);

	if (useBubbles)
		registerBubbleWorker(bubbleEl, model, model.getHeight(), function(_id){
			workerId = _id;
		});

	return IX.inherit(view, {
		setVisible : function(visible){
			if (useBubbles) enableBubbleWorker(workerId, visible);
		},
		hover : function(fn1, fn2){
			mouseoverFn = IX.isFn(fn1)?fn1 : IX.emptyFn;
			mouseoutFn = IX.isFn(fn2)?fn2 : IX.emptyFn;
		}
	});
}

/** 在指定显示区域viewbox内显示棱柱使用面贴图)
	viewbox : [x,y,w,h]
	options : {
		// type : "prism"
		schemes : 棱柱配色集,参考DefPolygonSchemes
		max : 最大显示数值 必须为正数
		value : 当前显示数值
		baseH : 最小柱体高度，即当前数值为0时高度
		// 不可用 showAvail : 是否显示剩余数值的柱体
		useBubbles : 是否使用bubbles组件,
		density : 每秒释放的气泡数量
	}
	return {
		setValue : function(v)
		setVisible : function(visible)
		hover : function(overFn, outFn)
	}
 */
nsD3.createImgFrustum = function(svg, viewbox, options){
	return new FrustumView(svg, viewbox, IX.inherit(options, {
		value : [options.value || 0]
	}));
};
/** 在指定显示区域viewbox内显示多段棱柱(使用面贴图)
	viewbox : ...
	options : {
		...
		value : [], 当前显示数值集合
		numOfSegments : 总和段数,必须提供
	}
	return {
		...
		setValue : function([v])
	}
 */
nsD3.createImgFrustumSegments = function(svg, viewbox, options){
	return new FrustumView(svg, viewbox, options)
};
})();