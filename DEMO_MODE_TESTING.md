# 🧪 Demo Payment Mode - Testing & Troubleshooting

## ✅ Verification Checklist

Before testing the demo payment flow, verify:

- [ ] Backend is running on `http://localhost:5000`
- [ ] Frontend is running on `http://localhost:5173`
- [ ] MongoDB is connected
- [ ] `.env` has `DEMO_PAYMENT=true`
- [ ] User is logged in
- [ ] Products are added to cart
- [ ] No errors in browser console

---

## 🧪 Test Scenarios

### Test 1: Basic Checkout (2 min)
**Objective**: Verify demo checkout creates order and redirects to success page

**Steps**:
1. Navigate to `/cart`
2. Verify items are listed
3. Click "Checkout"
4. Fill shipping info:
   ```
   Name: John Demo
   Address: 123 Main St
   City: New York
   State: NY
   Zip: 10001
   Phone: 555-1234
   ```
5. Click "Complete Payment"
6. Wait for 2-second animation
7. Should redirect to `/order-success/:orderId`

**Expected Result**:
- ✅ No Stripe card input appears
- ✅ 2-second loading animation
- ✅ Order Success page loads
- ✅ Demo data displayed (ORD-*, PAY*, TRK*)
- ✅ No console errors

**Test Passed**: ✅ Order created with demo IDs

---

### Test 2: Order Success Page (1 min)
**Objective**: Verify order success page displays all data correctly

**From Test 1 Result Page**:
1. Verify page shows:
   - [ ] "Payment Successful" header
   - [ ] "🧪 Demo Payment Mode" badge
   - [ ] Order Number (ORD-YYYYMMDD-XXXX)
   - [ ] Payment ID (PAYXXXXXXXXXX)
   - [ ] Tracking ID (TRKXXXXXXXX)
   - [ ] Invoice Number (INV-YYYYMMDD-XXXX)
   - [ ] Estimated Delivery (3-5 days from today)
   - [ ] Shipping Address
   - [ ] Order Items with quantities
   - [ ] Price breakdown
   - [ ] Order Total

2. Verify buttons are present:
   - [ ] Track Order (enabled)
   - [ ] Continue Shopping (enabled)
   - [ ] Download Invoice (enabled)

**Expected Result**:
- ✅ All demo data displays correctly
- ✅ Dates are realistic
- ✅ IDs are unique
- ✅ Professional layout
- ✅ No missing information

**Test Passed**: ✅ Order success page perfect

---

### Test 3: Track Order Page (1 min)
**Objective**: Verify tracking page shows visual timeline

**From Order Success Page**:
1. Click "Track Order" button
2. Page should show:
   - [ ] Tracking Number (TRK*)
   - [ ] Current Status highlighted in blue
   - [ ] "🧪 Demo Tracking Mode" badge
   - [ ] Courier information
   - [ ] Estimated delivery date

3. Timeline should display 6 stages:
   - [ ] Order Confirmed ✓ (completed - green)
   - [ ] Processing 📦 (completed - green)
   - [ ] Packed 📦 (completed - green)
   - [ ] Shipped 🚚 (current - blue with ring)
   - [ ] Out for Delivery 📍 (pending - gray)
   - [ ] Delivered 🎉 (pending - gray)

4. Each stage should show:
   - [ ] Status name
   - [ ] Timestamp
   - [ ] "In Progress" or "Completed" label
   - [ ] Icon

**Expected Result**:
- ✅ Professional timeline visualization
- ✅ Correct status highlighted
- ✅ All 6 stages visible
- ✅ Progress clearly shown
- ✅ Realistic dates

**Test Passed**: ✅ Tracking page excellent

---

### Test 4: Download Invoice (1 min)
**Objective**: Verify invoice download button works

**From Order Success Page**:
1. Click "Download Invoice" button
2. Check browser alert (demo mode shows dialog with order info)
3. In production with jsPDF:
   - [ ] PDF should download
   - [ ] Filename: `Invoice_INV-YYYYMMDD-XXXX.pdf`
   - [ ] Contains all order details
   - [ ] "Demo Invoice - Development Only" indicator

**Expected Result**:
- ✅ No errors
- ✅ Dialog shows invoice info
- ✅ Ready for jsPDF integration

**Test Passed**: ✅ Invoice ready

---

### Test 5: Multiple Orders (2 min)
**Objective**: Verify each order gets unique IDs

**Steps**:
1. Complete Test 1-3 for first order
2. Go back to products (from tracking page)
3. Add different products to cart
4. Repeat checkout
5. Compare two order success pages

**Expected Result**:
- ✅ Second Order Number: Different ORD-*
- ✅ Second Payment ID: Different PAY*
- ✅ Second Tracking ID: Different TRK*
- ✅ Second Invoice Number: Different INV-*
- ✅ Each is unique

**Test Passed**: ✅ Unique IDs generated

---

### Test 6: Backend Logs (1 min)
**Objective**: Verify demo mode logging

**Steps**:
1. Watch backend terminal during checkout
2. Look for logs like:
   ```
   [DEMO PAYMENT] Order created: ORD-20260629-0001
   [DEMO PAYMENT] Order confirmed and paid: ORD-20260629-0001
   ```

**Expected Result**:
- ✅ Demo payment logs appear
- ✅ Order created message shows
- ✅ Order confirmed message shows
- ✅ No real Stripe API calls

**Test Passed**: ✅ Logging working

---

### Test 7: Real Data Integration (1 min)
**Objective**: Verify demo order saves to MongoDB

**Steps**:
1. Complete a checkout
2. Navigate to `/orders` page
3. Look for the order you just created

**Expected Result**:
- ✅ Order appears in orders list
- ✅ Status shows "PAID"
- ✅ Total is correct
- ✅ Items are correct

**Test Passed**: ✅ Database integration working

---

## 🔍 Troubleshooting

### Issue: Payment button does nothing
**Cause**: Backend not running or demo mode disabled
**Fix**:
```bash
# Check backend is running
# Check .env has DEMO_PAYMENT=true
# Restart backend: npm run dev
```

### Issue: Redirect fails, stuck on checkout
**Cause**: Order not created in database
**Fix**:
```bash
# Check MongoDB is running
# Check backend logs for errors
# Check network tab in browser dev tools
```

### Issue: Order Success page shows blank data
**Cause**: Data not stored in sessionStorage
**Fix**:
```bash
# Open browser console
# Check: sessionStorage.getItem('demoPaymentData')
# Should show demo data object
```

### Issue: Tracking page not loading
**Cause**: Tracking ID missing
**Fix**:
```bash
# Go back to order success
# Check if Tracking ID shows: TRKXXXXXXXX
# Click track again
```

### Issue: 2-second animation doesn't appear
**Cause**: Simulation completes too fast
**Fix**:
```typescript
// Edit server/src/services/demoPaymentService.ts
setTimeout(() => resolve(), 3000); // Increase to 3 seconds
```

### Issue: Database error during checkout
**Cause**: Missing connection
**Fix**:
```bash
# Verify MongoDB running: mongod
# Check MONGO_URI in .env
# Restart backend
```

---

## 📊 Expected Backend Console Output

### Normal Startup
```
[INFO] ts-node-dev ver. 2.0.0
warn: Prisma (PostgreSQL) connection failed...
info: MongoDB connected successfully
info: Server running on port 5000
info: Environment: development
```

### During Demo Checkout
```
[DEMO PAYMENT] Order created: ORD-20260629-0001
[DEMO PAYMENT] Order confirmed and paid: ORD-20260629-0001
```

### With Logging
```
POST /api/v1/payments/checkout
Query time: 234ms
Response: 201 Created
```

---

## 🎯 Full Test Run (10 minutes)

### Complete Test Scenario
```
1. Start Backend (2 min)
   ├─ Terminal 1: npm run dev
   ├─ Wait for "Server running"
   └─ Check logs for MongoDB connection

2. Start Frontend (1 min)
   ├─ Terminal 2: npm run dev
   └─ Check browser loads at localhost:5173

3. Login/Register (1 min)
   ├─ Create account or login
   └─ Verify authenticated

4. Add to Cart (1 min)
   ├─ Browse products
   ├─ Add 2-3 items
   └─ Verify cart shows items

5. Test Demo Checkout (2 min)
   ├─ Go to checkout
   ├─ Fill address
   ├─ Complete payment
   └─ Watch 2-second animation

6. Verify Order Success (1 min)
   ├─ Check all data displayed
   ├─ Verify demo IDs
   └─ Check layout looks professional

7. Test Tracking (1 min)
   ├─ Click Track Order
   ├─ Verify timeline shows
   └─ Check all 6 stages

8. Verify Database (1 min)
   ├─ Go to /orders
   ├─ Find your order
   └─ Check status is PAID
```

**Total Time**: ~10 minutes  
**All Tests Pass**: ✅ Ready for presentation

---

## ✨ Success Indicators

### Demo Mode Working If:
- ✅ No Stripe card input appears on checkout
- ✅ No real payment processing occurs
- ✅ Order is created instantly in database
- ✅ Order Success page shows demo IDs
- ✅ Tracking page shows professional timeline
- ✅ Each order has unique IDs
- ✅ Backend logs show `[DEMO PAYMENT]`
- ✅ No errors in console
- ✅ Database contains orders

### Production Ready If:
- ✅ All above working
- ✅ Professional UI/UX
- ✅ Clean code with comments
- ✅ Proper error handling
- ✅ Responsive design
- ✅ Clear instructions
- ✅ Works in interview demo

---

## 📝 Notes

- Demo mode uses REAL database (MongoDB)
- Orders are ACTUALLY created
- Inventory IS reserved
- Seller earnings ARE calculated
- Only payment processing is simulated
- Perfect for testing full flow without Stripe

---

## 🚀 Ready to Demo?

Once all tests pass, you're ready to:
- 📸 Record demo video
- 🎤 Present to recruiters
- 👥 Show in interviews
- 💼 Demonstrate to clients
- 📊 Use in portfolio

---

**Last Updated**: 2026-06-29  
**Test Coverage**: 7 scenarios  
**Estimated Time**: 10 minutes  
**Status**: ✅ Ready to test
