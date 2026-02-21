<?php
$id = $_GET['id'] ?? '';
$key = "pk_8a629f7ca32dbf8a06e3b2ca4bc27c0fe90a54e08ffb7a960bd8e2892827f3fe";
$url = "https://marketplace-backend-101825326475.us-east1.run.app/store/products/$id?fields=*,variants.*,vehicle_product.*,images.*";

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["x-publishable-api-key: $key"]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$res = json_decode(curl_exec($ch), true);
$car = $res['product'];
?>
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="brand.css">
    <title><?php echo $car['title']; ?></title>
</head>
<body>
<header>
    <a href="index.php" class="logo">CAUCASUS <span>IMPEX</span></a>
    <nav class="nav-links"><a href="index.php">Back to Stock</a></nav>
</header>

<div style="padding: 150px 8% 50px; display: flex; gap: 50px;">
    <div style="flex: 1.5;"><img src="<?php echo $car['thumbnail']; ?>" style="width: 100%; border: 1px solid #222;"></div>
    <div style="flex: 1;">
        <h1 style="font-size: 3rem; margin: 0;"><?php echo $car['title']; ?></h1>
        <div style="color: #e61e25; font-size: 2.5rem; font-weight: 900; margin: 20px 0;">$<?php echo number_format($car['variants'][0]['calculated_price']); ?></div>
        <div style="background: #111; padding: 20px; border-radius: 4px;">
            <p><strong>VIN:</strong> <?php echo $car['vehicle_product']['vin']; ?></p>
            <p><strong>ENGINE:</strong> <?php echo $car['vehicle_product']['engine_capacity']; ?></p>
        </div>
        <a href="https://wa.me/995593674190" style="display: block; background: #e61e25; color: white; text-align: center; padding: 20px; text-decoration: none; font-weight: 900; margin-top: 30px;">RESERVE NOW</a>
    </div>
</div>
</body>
</html>