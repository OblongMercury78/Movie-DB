from flask import Flask, render_template, request
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class Movies(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    release_year = db.Column(db.Integer, nullable=False)
    genre = db.Column(db.String(20), nullable=False)
    link = db.Column(db.String(40), unique=True, nullable=False)
    productions = db.relationship('Production', backref='movie', lazy=True)
    reviews = db.relationship('Review', backref='movie', lazy=True)

class Production(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    staff_name = db.Column(db.String(30), nullable=False)
    role = db.Column(db.String(20), nullable=False)
    studio = db.Column(db.String(40), nullable=False)
    movie_id = db.Column(db.Integer, db.ForeignKey('movies.id'), nullable=False)

class Review(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    reviewer_id = db.Column(db.Integer, nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    age_rating = db.Column(db.String(30), nullable=False)
    movie_id = db.Column(db.Integer, db.ForeignKey('movies.id'), nullable=False)

@app.route('/members', methods=['GET', 'POST'])
def members():
    if request.method == 'POST':
        name = request.form['name']
        release_year = request.form['release_year']
        genre = request.form['genre']
        link = request.form['link']

        # Create a new Movies instance and add it to the database
        new_movie = Movies(name=name, release_year=release_year, genre=genre, link=link)
        db.session.add(new_movie)
        db.session.commit()

        # Get the ID of the newly added movie
        movie_id = new_movie.id

        # Get production information from the form
        staff_names = request.form.getlist('staff_name[]')
        roles = request.form.getlist('role[]')
        studios = request.form.getlist('studio[]')

        # Create Production instances and add them to the database
        for staff_name, role, studio in zip(staff_names, roles, studios):
            new_production = Production(staff_name=staff_name, role=role, studio=studio, movie_id=movie_id)
            db.session.add(new_production)

        # Get review information from the form
        reviewer_ids = request.form.getlist('reviewer_id[]')
        ratings = request.form.getlist('rating[]')
        age_ratings = request.form.getlist('age_rating[]')

        # Create Review instances and add them to the database
        for reviewer_id, rating, age_rating in zip(reviewer_ids, ratings, age_ratings):
            new_review = Review(reviewer_id=reviewer_id, rating=rating, age_rating=age_rating, movie_id=movie_id)
            db.session.add(new_review)

        db.session.commit()

    # Fetch all movies, productions, and reviews from the database
    all_movies = Movies.query.all()

    # For each movie, fetch associated production and review records
    for movie in all_movies:
        movie.productions = Production.query.filter_by(movie_id=movie.id).all()
        movie.reviews = Review.query.filter_by(movie_id=movie.id).all()

    return render_template('members.html', movies=all_movies)

if __name__ == "__main__":
    app.run(debug=True)
