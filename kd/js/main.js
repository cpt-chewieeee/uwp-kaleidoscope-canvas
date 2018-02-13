// For an introduction to the Blank template, see the following documentation:
// https://go.microsoft.com/fwlink/?LinkId=232509

(function () {
	"use strict";

	var app = WinJS.Application;
	var activation = Windows.ApplicationModel.Activation;
    var isFirstActivation = true;

    var canvas;
    var guide;
    var ctx;
   
    var guideCtx;
    var ctxprops = {};
    var cursor = {};
    var currentpoint;
    var kaleido = true;
    var segments = 16;
    var strokemultiplier = 5;
    var bgcolour = "#FFF";
    var r = 360 / segments * Math.PI / 180;


	app.onactivated = function (args) {
		if (args.detail.kind === activation.ActivationKind.voiceCommand) {
			// TODO: Handle relevant ActivationKinds. For example, if your app can be started by voice commands,
			// this is a good place to decide whether to populate an input field or choose a different initial view.
		}
		else if (args.detail.kind === activation.ActivationKind.launch) {
			// A Launch activation happens when the user launches your app via the tile
			// or invokes a toast notification by clicking or tapping on the body.
			if (args.detail.arguments) {
				// TODO: If the app supports toasts, use this value from the toast payload to determine where in the app
				// to take the user in response to them invoking a toast notification.
			}
			else if (args.detail.previousExecutionState === activation.ApplicationExecutionState.terminated) {
				// TODO: This application had been suspended and was then terminated to reclaim memory.
				// To create a smooth user experience, restore application state here so that it looks like the app never stopped running.
				// Note: You may want to record the time when the app was last suspended and only restore state if they've returned after a short period.
			}
		}

		if (!args.detail.prelaunchActivated) {
			// TODO: If prelaunchActivated were true, it would mean the app was prelaunched in the background as an optimization.
			// In that case it would be suspended shortly thereafter.
			// Any long-running operations (like expensive network or disk I/O) or changes to user state which occur at launch
			// should be done here (to avoid doing them in the prelaunch case).
			// Alternatively, this work can be done in a resume or visibilitychanged handler.
		}

		if (isFirstActivation) {
			// TODO: The app was activated and had not been running. Do general startup initialization here.
			document.addEventListener("visibilitychange", onVisibilityChanged);
            args.setPromise(WinJS.UI.processAll().then(function () {
                canvas = document.getElementById("canvas");
                ctx = canvas.getContext("2d");
                ctx.lineCap = "round";
                canvas.setAttribute("width", document.body.clientWidth);
                canvas.setAttribute("height", document.body.clientHeight);

                function render() {
                    for (var i = 0; i < segments; ++i) {
                        ctx.save();
                        ctx.translate(document.body.clientWidth / 2, document.body.clientHeight / 2);
                        ctx.rotate(r * i);

                        if (segments % 2 === 2 && i > 0 && i % 2 !== 0) {
                            ctx.scale(1, -1);
                            if (segments % 4 === 0) {
                                ctx.rotate(r);
                            }
                        }
                        ctx.beginPath();
                        ctx.moveTo(cursor.lx - document.body.clientWidth / 2, cursor.ly - document.body.clientHeight / 2);
                        ctx.lineTo(cursor.x - document.body.clientWidth / 2, cursor.y - document.body.clientHeight / 2);
                        ctx.stroke();
                        ctx.restore();
                    }
                }

                function onMove (e) {
                    e.stopPropagation();
                    e.preventDefault();

                        
                    ctx.lineWidth = strokemultiplier;
                     
                    cursor.x = e.clientX;
                    cursor.y = e.clientY;
                       

                    render();

                    cursor.lx = cursor.x;
                    cursor.ly = cursor.y;
                    
                }
                function onUp(e) {
                    document.removeEventListener("mouseup", onUp);
                    document.removeEventListener("mousemove", onMove);
                }
                canvas.addEventListener("mousedown", function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    // if (currentpoint) return;
                    currentpoint = 1;
                    document.addEventListener("mousemove", onMove);
                    document.addEventListener("mouseup", onUp); 

                    cursor.x = cursor.lx = e.clientX;
                    cursor.y = cursor.ly = e.clientY;

                });

            }));
		}

		isFirstActivation = false;
	};

	function onVisibilityChanged(args) {
		if (!document.hidden) {
			// TODO: The app just became visible. This may be a good time to refresh the view.
		}
	}

	app.oncheckpoint = function (args) {
		// TODO: This application is about to be suspended. Save any state that needs to persist across suspensions here.
		// You might use the WinJS.Application.sessionState object, which is automatically saved and restored across suspension.
		// If you need to complete an asynchronous operation before your application is suspended, call args.setPromise().
	};

	app.start();

})();
