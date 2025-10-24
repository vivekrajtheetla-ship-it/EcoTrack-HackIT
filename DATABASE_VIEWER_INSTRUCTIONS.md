# 🗄️ EcoTrack Database Viewer Instructions

## 📊 How to View Your Database Data

### 🌐 **Web-Based Database Viewer**
I've created a beautiful web-based database viewer for you to monitor all your MongoDB data in real-time.

#### **Access the Database Viewer:**
1. Open the file `database_viewer.html` in your web browser
2. Or visit: `file:///C:/Users/vivek/Ecotrack/database_viewer.html`

#### **Features Available:**
- 📈 **Real-time Statistics**: Total users, activities, points, and CO₂ saved
- 👥 **User Management**: View all registered users and their data
- 📊 **Activity Tracking**: Monitor all logged activities with details
- 🔄 **Live Refresh**: Update data in real-time
- 🗑️ **Database Reset**: Clear all data (development only)

### 🔧 **API Endpoints for Database Access**

#### **View All Data:**
```
GET http://localhost:5002/api/admin/database
```

#### **View Users Only:**
```
GET http://localhost:5002/api/admin/users
```

#### **View Activities Only:**
```
GET http://localhost:5002/api/admin/activities
```

#### **Reset Database:**
```
DELETE http://localhost:5002/api/admin/reset
```

### 📱 **Current Server Status**

✅ **Backend**: Running on http://localhost:5002
✅ **Frontend**: Running on http://localhost:3001
✅ **Database**: Local MongoDB connected
✅ **Database Viewer**: Ready to use

### 🎯 **What You Can Monitor**

#### **User Data:**
- Email addresses
- Eco-points earned
- Carbon reduction goals
- Registration dates

#### **Activity Data:**
- Transport activities (vehicle type, distance)
- Energy usage (electricity consumption)
- Food choices (meal types)
- Carbon emissions calculated
- Points earned per activity
- Timestamps and user associations

#### **Statistics:**
- Total registered users
- Total activities logged
- Total eco-points in system
- Total CO₂ emissions tracked

### 🚀 **How to Use**

1. **Start the Application:**
   - Backend and frontend are already running
   - Visit http://localhost:3001 to use EcoTrack

2. **Register/Login Users:**
   - Create test accounts on the landing page
   - Log various activities (transport, energy, food)

3. **View Database:**
   - Open `database_viewer.html` in your browser
   - Click "Refresh Data" to see latest information
   - Use different view buttons to filter data

4. **Monitor in Real-time:**
   - As users log activities, refresh the viewer
   - Watch statistics update automatically
   - Track user engagement and app usage

### 🔒 **MongoDB Atlas Connection**

**Note:** The MongoDB Atlas credentials you provided seem to have authentication issues. The app is currently running with local MongoDB. 

**To use your MongoDB Atlas:**
1. Verify the username and password are correct
2. Check that the database user has read/write permissions
3. Ensure your IP address is whitelisted in MongoDB Atlas
4. Update the connection string in `backend/.env`

**Current Connection String Format:**
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?options
```

### 🎨 **Database Viewer Features**

- **Modern UI**: Beautiful, responsive design
- **Real-time Updates**: Live data refresh
- **Interactive Tables**: Sortable and searchable
- **Statistics Dashboard**: Visual metrics
- **Error Handling**: Clear error messages
- **Mobile Friendly**: Works on all devices

### 🛠️ **Troubleshooting**

**If Database Viewer Shows No Data:**
1. Make sure backend server is running (port 5002)
2. Check browser console for errors
3. Verify API endpoints are accessible
4. Try refreshing the data manually

**If MongoDB Atlas Connection Fails:**
1. Double-check credentials in MongoDB Atlas
2. Verify IP whitelist includes your current IP
3. Test connection with MongoDB Compass
4. Check cluster status in Atlas dashboard

The database viewer is now ready to help you monitor all your EcoTrack application data! 🌱📊