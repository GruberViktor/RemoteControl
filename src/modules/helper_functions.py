import threading


def debounced(function, seconds, *args):
    def call_it():
        function(*args)

    try:
        debounced.t.cancel()

    except (AttributeError):
        pass
    debounced.t = threading.Timer(seconds, call_it)
    debounced.t.start()
