<?php
$api_key = "pk_2a4a899f20baeb0b17fbb95770f00c8387a44eef1e38fd647a174273cf28cd34";
$api_url = "https://marketplace-backend-staging-155521043283.us-east1.run.app/store/inventory/products?limit=5&fields=id,title,thumbnail,variants.calculated_price,vehicle_product.*";

$ch = curl_init($api_url);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["x-publishable-api-key: $api_key"]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$data = json_decode(curl_exec($ch), true);
$vehicles = $data['products'] ?? [];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Caucasus Impex</title>
    <link rel="stylesheet" href="brand.css">
</head>
<body>

<header style="padding: 20px 8%; border-bottom: 1px solid #222; display: flex; justify-content: space-between;">
    <div style="font-weight: 900; font-size: 1.2rem;">CAUCASUS <span style="color: #e61e25;">IMPEX</span></div>
    <nav>
        <a href="#" style="color: #888; text-decoration: none; font-weight: 700; font-size: 0.75rem;">INVENTORY</a>
    </nav>
</header>

<section class="hero-wrap">
    <h1 style="font-size: 4.5rem; margin: 0; line-height: 1;">DRIVE <span style="color: #e61e25;">EXCELLENCE</span></h1>
    <p>Discover a curated collection of premium vehicles with professional global logistics.</p>
</section>

<section class="highlights-banner">
    <div class="highlight-item">
        <h4>PREMIUM QUALITY</h4>
        <p>Rigorous 150-point inspection.</p>
    </div>
    <div class="highlight-item">
        <h4>GLOBAL SHIPPING</h4>
        <p>International delivery handled.</p>
    </div>
    <div class="highlight-item">
        <h4>FINANCING</h4>
        <p>Competitive rates available.</p>
    </div>
</section>

<section class="inventory-section">
    <h2 style="font-weight: 900; text-transform: uppercase; margin-bottom: 30px;">LATEST ARRIVALS</h2>
    
    <div class="scroll-box">
        <div class="car-grid">
            <?php foreach ($vehicles as $car): ?>
            <div class="car-card">
                <img src="<?php echo $car['thumbnail']; ?>" alt="Car">
                <div style="padding: 20px;">
                    <h3 style="margin: 0; font-size: 1rem;"><?php echo $car['title']; ?></h3>
                    <p style="color: #e61e25; font-weight: 900; font-size: 1.2rem; margin: 10px 0;">
                        $<?php echo number_format($car['variants'][0]['calculated_price'] ?? 0); ?>
                    </p>
                    <a href="product.php?id=<?php echo $car['id']; ?>" class="availability-link">CHECK AVAILABILITY</a>
                </div>
            </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<footer style="padding: 80px 8%; border-top: 1px solid #222; text-align: center; color: #444;">
    © 2026 CAUCASUS IMPEX GROUP
</footer>

</body>
</html>