from flask import Flask, request, jsonify,  session, flash, redirect, url_for
from flask_bcrypt import Bcrypt
from flask_login import LoginManager, login_required, UserMixin, login_user, logout_user, current_user
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import LargeBinary, func
from flask_mail import Mail, Message
import base64

# Initialize Flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = 'car_trader_flush_key'
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'hamonymakumbirofa@gmail.com'
app.config['MAIL_PASSWORD'] = 'keto dyiu utmt nafq'
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://admin:admin@127.0.0.1/car_trading' 
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False


# Initialize Flask extensions
db = SQLAlchemy(app)
mail = Mail(app)
bcrypt = Bcrypt(app)
CORS(app)
login_manager = LoginManager(app)
login_manager.login_view = 'login'

# Define a function to check if the user is logged in
def check_login():
    # Check if the current user is not authenticated and the requested route is not the login or signup route
    if not current_user.is_authenticated and request.endpoint not in ['login', 'signup']:
        # Redirect the user to the login page
        return redirect(url_for('login'))

# Register the check_login function to be executed before each request
app.before_request(check_login)

# User class for Flask-Login
class User(UserMixin, db.Model):
    __tablename__ = 'user'
    
    userID = db.Column(db.Integer, primary_key=True)
    userName = db.Column(db.String(100), unique=True, nullable=False)
    userType = db.Column(db.String(50), nullable=False)
    password = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(15), nullable=False)
    isActive = db.Column(db.Integer, default=0)

    def __init__(self, userID, userName, userType, password, email, phone, isActive=0):
        self.userID = userID
        self.userName = userName
        self.userType = userType
        self.password = password
        self.email = email
        self.phone = phone
        self.isActive = isActive

    def __repr__(self):
        return f"User(userID={self.userID}, userName={self.userName}, userType={self.userType}, password={self.password}, email={self.email}, phone={self.phone}, isActive={self.isActive})"
    
    # Flask-Login attributes and methods
    def is_active(self):
        return self.isActive
    
    def get_id(self):
        return (self.userID)
    
    def serialize(self):
        return {
            'id': self.userID,
            'name': self.userName,       
            'email': self.email,     
            'userType': self.userType,
            'isActive': self.isActive
    }


# cars code
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
    isActive = 1
    
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
    return User.query.get(userID)
   
@app.route('/submit', methods=['POST'])
def submit_form():
    if request.method == 'POST':
        # Access form data from request.form
        username = request.form.get('username')
        password = request.form.get('password')

        return f'Username: {username}, Password: {password}'
    else:
        return 'Method not allowed'

@app.route('/signup', methods=['POST'])


def signup(): 
    try:
        # Extract JSON data from the request
        data = request.get_json()
        userName = data.get('userName')
        userType = data.get('userType')
        password = data.get('password')
        email = data.get('email')
        phone = data.get('phone')
        # Determine isActive based on userType
        isActive = 0 if userType in ['Seller', 'Admin'] else 1

        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        new_user = User(userName=userName, userType=userType, password=hashed_password, email=email, phone=phone, isActive=isActive)
        db.session.add(new_user)
        db.session.commit()

        # Flash success message and redirect to login page
        flash('Signup successful! Please login.', 'success')
        return jsonify({'redirect': '/login'})
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    
# Route for user login  

@app.route('/login', methods=['POST'])
def login():
    # Extract JSON data from the request
    data = request.get_json()
    userName = data.get('userName')
    userType = data.get('userType')
    password = data.get('password')

    if not (userName and userType and password):
        return jsonify({'error': 'Invalid form data.'}), 400

    # Query the User model
    user = User.query.filter_by(userName=userName, userType=userType).first()

    if user and bcrypt.check_password_hash(user.password, password):
        login_user(user)  # Use Flask-Login's login_user function

        # Redirect based on user type
        if user.userType == "Seller":
            return jsonify({'redirect': '/SellerDashboard'})
        elif user.userType == "Buyer":
            return jsonify({'redirect': '/BuyerDashboard'})
        elif user.userType == "Admin":
            return jsonify({'redirect': '/AdminDashboard'})
    else:
        return jsonify({'error': 'Invalid username or password.'}), 401

from flask_login import current_user

@app.route('/session-details', methods=['GET'])
@login_required  # Protect the route with authentication
def get_session_details():
    if current_user.is_authenticated:
        return jsonify({
            'userID': current_user.userID,
            'userName': current_user.userName,
            'userType': current_user.userType
        }), 200
    else:
        return jsonify({'error': 'User not authenticated'}), 401


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
@login_required
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
        userID = current_user.userID
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

@app.route('/send_email', methods=['POST'])
@login_required
def send_email():
    try:
        # Get form data from the request
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        message = data.get('message')

        # Construct the email
        msg = Message('Contact Form Submission', sender='hamonymakumbirofa@gmail.com', recipients=['hamonymakumbirofa@gmail.com'])
        msg.body = f"The following client is interested in your Car:\nName: {name}\nEmail: {email}\nMessage: {message}"

        # Send the email
        mail.send(msg)

        return jsonify({'message': 'Email sent successfully!'})
    except Exception as e:
        return jsonify({'error': str(e)})

# Route to fetch unique makes from the database
@app.route('/makes', methods=['GET'])
def get_unique_makes():
    try:
        # Query distinct makes from the Car table
        unique_makes = db.session.query(Car.make).distinct().all()
        makes_list = [make[0] for make in unique_makes]
        return jsonify(makes_list), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/models', methods=['GET'])
def get_models():
    try:
        selected_make = request.args.get('make')

        # Query models associated with the selected make from the Car table
        models = Car.query.filter_by(make=selected_make).with_entities(Car.model).distinct().all()
        model_list = [model[0] for model in models]

        return jsonify(model_list), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/sellers', methods=['GET'])
def get_sellers():
    sellers = User.query.filter_by(userType="Seller").all()
    return jsonify([seller.serialize() for seller in sellers])

@app.route('/buyers', methods=['GET'])
def get_buyers():
    buyers = User.query.filter_by(userType="Buyer").all()
    return jsonify([buyer.serialize() for buyer in buyers])

@app.route('/toggleStatus/<int:user_id>', methods=['POST'])
def toggle_status(user_id):
    # Get the user by ID
    user = User.query.get(user_id)
    
    # Check if the user exists
    if not user:
        return jsonify({'error': 'User not found'}), 404

    # Toggle the status
    user.isActive = not user.isActive

    # Commit the changes to the database
    db.session.commit()

    # Return the new status to the frontend
    return jsonify({'isActive': user.isActive})

@app.route('/toggleCarStatus/<string:vinNumber>', methods=['POST'])
def toggle_car_status(vinNumber):
    # Get the car by VIN number
    car = Car.query.filter_by(vinNumber=vinNumber).first()
    
    # Check if the car exists
    if not car:
        return jsonify({'error': 'Car not found'}), 404

    # Toggle the status
    car.isActive = not car.isActive

    # Commit the changes to the database
    db.session.commit()

    # Return the new status to the frontend
    return jsonify({'isActive': car.isActive})

@app.route('/myCars')
def get_my_cars():
    try:
        # Get the userID from the session
        userID = current_user.userID
        # Query cars associated with the userID
        cars = Car.query.filter_by(userID=userID).all()

        # Serialize the cars data
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
                'mileage': car.mileage,
                'isActive': car.isActive,

                'imageData': base64.b64encode(car.imageData).decode('utf-8') if car.imageData else None
            }
            serialized_cars.append(serialized_car)

        return jsonify(serialized_cars), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/update_car/<string:vin_number>', methods=['PUT'])
def update_car(vin_number):
    try:
        vinNumber = vin_number
        engNumber = request.form.get('engNumber')
        make = request.form.get('make')
        model = request.form.get('model')
        regDate = request.form.get('regDate')
        color = request.form.get('color')
        bodyType = request.form.get('bodyType')
        gearBoxType = request.form.get('gearBoxType')
        price = float(request.form.get('price'))
        description = request.form.get('description')
        userID = current_user.userID
        mileage = request.form.get('mileage')
        
        # Get image data
        image_data = request.files['imageData'].read()

        # Find the car to update
        car = Car.query.filter_by(vinNumber=vinNumber).first()

        if not car:
            return jsonify({'error': 'Car not found'}), 404

        # Update car details
        car.engNumber = engNumber
        car.make = make
        car.model = model
        car.regDate = regDate
        car.color = color
        car.bodyType = bodyType
        car.gearBoxType = gearBoxType
        car.price = price
        car.description = description
        car.userID = userID
        car.mileage = mileage
        car.imageData = image_data

        # Commit changes to the database
        db.session.commit()

        return jsonify({'message': 'Car updated successfully!'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    
@app.route('/update_car_status/<vinNumber>', methods=['POST'])
def update_car_status(vinNumber):
    try:
        action = request.json.get('action')
        car = Car.query.filter_by(vinNumber=vinNumber).first()
        if car:
            if action == 'enable':
                car.isActive = 1
            elif action == 'disable':
                car.isActive = 0
            db.session.commit()
            return jsonify({'message': 'Car updated successfully.'}), 200
        else:
            return jsonify({'error': 'Car not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
# Route to delete a car
@app.route('/delete_car/<vinNumber>', methods=['DELETE'])
def delete_car(vinNumber):
    try:
        car = Car.query.filter_by(vinNumber=vinNumber).first()
        if car:
            db.session.delete(car)
            db.session.commit()
            return jsonify({'message': 'Car deleted successfully.'}), 200
        else:
            return jsonify({'error': 'Car not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Route to mark a car as sold
@app.route('/markAsSold/<string:vinNumber>', methods=['PUT'])
def mark_as_sold(vinNumber):
    try:
        # Find the car to mark as sold
        car = Car.query.filter_by(vinNumber=vinNumber).first()

        if not car:
            return jsonify({'error': 'Car not found'}), 404

        # Update the car's sold status
        car.isActive = 0  
        db.session.commit()

        return jsonify({'message': 'Car marked as sold successfully!'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Define the route for updating user profiles
@app.route('/userUpdate/<string:user_id>', methods=['PUT'])
def user_update(user_id):
    try:
        # Get the user ID from the route parameter
        user_id = int(user_id)

        # Get the JSON data from the request
        data = request.get_json()

        # Retrieve the user from the database
        user = User.query.get(user_id)

        # Check if the user exists
        if not user:
            return jsonify({'error': 'User not found'}), 404

        # Update the user's profile information
        user.userName = data.get('userName', user.userName)
        user.userType = data.get('userType', user.userType)
        user.email = data.get('email', user.email)
        user.phone = data.get('phone', user.phone)

        # Commit the changes to the database
        db.session.commit()

        # Return a success message
        return jsonify({'message': 'User profile updated successfully'}), 200

    except Exception as e:
        # Return an error message if an exception occurs
        return jsonify({'error': str(e)}), 500

# Define the route for getting user information by userName
@app.route('/userByUsername', methods=['GET'])
def get_user_by_username():
    try:
        # Retrieve the userName from the session
        userName = current_user.userName
        
        # Query the user by userName from the database
        user = User.query.filter_by(userName=userName).first()

        # Check if the user exists
        if not user:
            return jsonify({'error': 'User not found'}), 404

        # Serialize the user object to JSON
        user_data = {
            'userID': user.userID,
            'userName': user.userName,
            'userType': user.userType,
            'email': user.email,
            'phone': user.phone
        }

        # Return the user information
        return jsonify(user_data), 200

    except Exception as e:
        # Return an error message if an exception occurs
        return jsonify({'error': str(e)}), 500

@app.route('/filter_cars', methods=['GET'])
def filter_cars():
    try:
        # Get filter parameters from the request
        make = request.args.get('make')
        model = request.args.get('model')
        min_price = request.args.get('minPrice')
        max_price = request.args.get('maxPrice')
        start_year = request.args.get('startYear')
        end_year = request.args.get('endYear')

        # Start building the query
        query = Car.query

        # Add filters based on provided parameters
        if make:
            query = query.filter(Car.make == make)
        if model:
            query = query.filter(Car.model == model)
        if min_price:
            query = query.filter(Car.price >= float(min_price))
        if max_price:
            query = query.filter(Car.price <= float(max_price))
        if start_year:
            query = query.filter(func.year(Car.regDate) >= int(start_year))
        if end_year:
            query = query.filter(func.year(Car.regDate) <= int(end_year))

        # Execute the query and fetch the filtered cars
        filtered_cars = query.all()

        # Serialize the filtered cars data
        serialized_cars = []
        for car in filtered_cars:
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
                'mileage': car.mileage,
                'imageData': base64.b64encode(car.imageData).decode('utf-8') if car.imageData else None
            }
            serialized_cars.append(serialized_car)

        return jsonify(serialized_cars), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)