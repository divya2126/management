const Notification = require("../model/Notification.model");

// Send a new notification
exports.createNotification = async (req, res) => {
  try {
    const { message, type, targetRole } = req.body;
    
    // Validate
    if (!message) {
      return res.status(400).json({ success: false, message: "Message is required" });
    }

    const newNotification = new Notification({
      senderId: req.user.id,
      message,
      type: type || "general",
      targetRole: targetRole || "all",
    });

    await newNotification.save();

    // Populate sender name for the socket event
    await newNotification.populate("senderId", "name email role");

    // Emit via Socket.io
    const io = req.app.get("io");
    if (io) {
      io.emit("new-notification", newNotification);
    }

    res.status(201).json({ success: true, notification: newNotification });
  } catch (error) {
    console.error("Create notification error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get all notifications (can be enhanced with pagination/filtering)
exports.getNotifications = async (req, res) => {
  try {
    const roleQuery = req.user.role === "admin" ? {} : { targetRole: { $in: ["all", req.user.role] } };

    const notifications = await Notification.find(roleQuery)
      .populate("senderId", "name email role")
      .sort({ createdAt: -1 })
      .limit(50); // Get latest 50
      
    res.status(200).json({ success: true, notifications });
  } catch (error) {
    console.error("Get notifications error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
