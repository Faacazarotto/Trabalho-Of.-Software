from Flask import Flask, render_template, redirect, url_for
import subprocess

app = Flask(__name__)

#Página Inicial

@app.route("/")
def index():
    return render_templates("index.html")

#Rotas para abrir os jogos
@app.route("/play/snakegame")
def play_snake():
    subprocess.Popen(["python", "jogos/snakegame.py"])
    return redirect(url_for("index"))

@app.route("/play/pong")
def play_pingpong():
    subprocess.Popen(["python", "jogos/pong.py"])

@app.route("/play/quiz")
def play_quiz():
    subprocess.Popen(["python", "jogos/quiz.py"])

@app.route("play/memoria")
def play_memoria():
    subprocess.Popen(["python", "jogos/memoria.py"])


if __name__ == "__main__":
    app.run(debug=True)    