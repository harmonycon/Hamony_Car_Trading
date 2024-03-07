from flask import Flask, request, jsonify, redirect, url_for, session, flash
from flask_bcrypt import Bcrypt
from flask_login import LoginManager, login_required, UserMixin, login_user, logout_user, current_user
import mysql.connector
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import LargeBinary

# Initialize Flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key'  # Set a secret key for Flash messages

# Initialize Flask extensions
bcrypt = Bcrypt(app)
CORS(app)
login_manager = LoginManager(app)
login_manager.login_view = 'login'

# MySQL database connection
mysql = mysql.connector.connect(user='admin', password='admin', host='127.0.0.1', database='car_trading')

# User class for Flask-Login
class User(UserMixin):
    def __init__(self, userID, userName, userType):
        self.id = userID
        self.userName = userName
        self.userType = userType

# cars code
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://admin:admin@127.0.0.1/car_trading' 
db = SQLAlchemy(app)

class Car(db.Model):
    vinNumber = db.Column(db.String(100), primary_key=True)
    engNumber = db.Column(db.String(100))
    make = db.Column(db.String(100), nullable=False)
    model = db.Column(db.String(100), nullable=False)
    regDate = db.Column(db.Date)
    color = db.Column(db.String(50))
    bodyType = db.Column(db.String(50))
    gearBoxType = db.Column(db.String(50))
    price = db.Column(db.Float, nullable=False)
    description = db.Column(db.Text)
    userID = db.Column(db.Integer)
    mileage = db.Column(db.Integer)
    imageData = db.Column(db.LargeBinary)

    __tablename__ = 'cars'

    def __repr__(self):
        return f"Car(vinNumber={self.vinNumber}, make={self.make}, model={self.model}, regDate={self.regDate}, color={self.color}, bodyType={self.bodyType}, gearBoxType={self.gearBoxType}, price={self.price}, description={self.description}, userID={self.userID}, mileage={self.mileage})"



# Loader function for Flask-Login
@login_manager.user_loader
def load_user(userID):
    user = query_user_by_id(userID)
    if user:
        return user
    else:
        return None

# Database query function to get user by ID
def query_user_by_id(userID):
    select_query = 'SELECT * FROM User WHERE userID = %s'
    cursor = mysql.cursor()
    cursor.execute(select_query, (userID,))
    user = cursor.fetchone()
    
    if user:
        return User(user[0], user[1], user[2])
    else:
        return None
@app.route('/submit', methods=['POST'])
def submit_form():
    if request.method == 'POST':
        # Access form data from request.form
        username = request.form.get('username')
        password = request.form.get('password')

        # Do something with the form data
        return f'Username: {username}, Password: {password}'
    else:
        return 'Method not allowed'

# Route for user signup    
@app.route('/signup', methods=['POST'])
def signup():

    # Extract JSON data from the request
    data = request.get_json()
    userName = data.get('userName')
    userType = data.get('userType')
    password = data.get('password')

    # Check if all required fields are provided
    if not userName or not userType or not password:
        flash('Invalid form data. Please provide all required fields.', 'error')
        return redirect(url_for('login'))

    # Proceed with signup process
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    insert_query = '''
        INSERT INTO User (userName, UserType, Password)
        VALUES (%s, %s, %s)
    '''
    cursor = mysql.cursor()
    cursor.execute(insert_query, (userName, userType, hashed_password))
    mysql.commit()

    # Flash success message and redirect to login page
    flash('Signup successful! Please login.', 'success')
    #return jsonify({'redirect': '/login'})

    return jsonify({'result':True})

# Route for user login    
@app.route('/login', methods=['GET', 'POST'])
def login():

    # Extract JSON data from the request
    data = request.get_json()
    userName = data.get('userName')
    userType = data.get('userType')
    password = data.get('password')

    if not (userName and userType and password):
        return jsonify({'error': 'Invalid form data.'}), 400

    select_query = 'SELECT * FROM User WHERE userName = %s AND userType = %s'
    cursor = mysql.cursor()
    cursor.execute(select_query, (userName, userType))
    user = cursor.fetchone()

    if user and bcrypt.check_password_hash(user[3], password):
        session['userID'] = user[0]
        session['userName'] = user[1]
        session['userType'] = user[2]

        login_user(User(user[0], user[1], user[2]))

        # Redirect based on user type
        if session['userType'] == "Seller":
            return jsonify({'redirect': '/seller'})
        elif session['userType'] == "Buyer":
            return jsonify({'redirect': '/buyer'})
        elif session['userType'] == "Admin":
            return jsonify({'redirect': '/admin'})
    else:
        return jsonify({'error': 'Invalid username or password.'}), 401

# Route for user logout
@app.route('/logout', methods=['POST'])
def logout():
    logout_user()
    session.pop('userID', None)
    session.pop('userName', None)
    session.pop('userType', None)
    return jsonify({'message': 'You have been logged out.'})

from flask import request, jsonify

@app.route('/add_car', methods=['POST'])
def add_car():
    try:
        vinNumber = request.form.get('vinNumber')
        engNumber = request.form.get('engNumber')
        make = request.form.get('make')
        model = request.form.get('model')
        regDate = request.form.get('regDate')
        color = request.form.get('color')
        bodyType = request.form.get('bodyType')
        gearBoxType = request.form.get('gearBoxType')
        price = float(request.form.get('price'))
        description = request.form.get('description')
        userID = request.form.get('userID')
        mileage = request.form.get('mileage')
        
        # Get image data
        image_data = request.files['imageData'].read()

        new_car = Car(vinNumber=vinNumber, engNumber=engNumber, make=make, model=model, regDate=regDate, 
                      color=color, bodyType=bodyType, gearBoxType=gearBoxType, price=price, description=description, 
                      userID=userID, mileage=mileage, imageData=image_data)
        db.session.add(new_car)
        db.session.commit()

        return jsonify({'message': 'Car added successfully!'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

import base64

@app.route('/get_cars')
def get_cars():
    try:
        # Query all cars from the database
        cars = Car.query.all()

        # Serialize the cars data to a format that can be sent as JSON
        serialized_cars = []
        for car in cars:
            serialized_car = {
                'vinNumber': car.vinNumber,
                'engNumber': car.engNumber,
                'make': car.make,
                'model': car.model,
                'regDate': car.regDate.isoformat() if car.regDate else None,
                'color': car.color,
                'bodyType': car.bodyType,
                'gearBoxType': car.gearBoxType,
                'price': car.price,
                'description': car.description,
                'userID': car.userID,
                'mileage': car.mileage,
                'imageData': base64.b64encode(car.imageData).decode('utf-8') if car.imageData else None
            }
            serialized_cars.append(serialized_car)

        return jsonify(serialized_cars), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
