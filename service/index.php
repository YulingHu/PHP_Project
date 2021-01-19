<?php
function print_content($header, $content)
{
    header($header);
    print($content);
    die();
}

function create_database()
{
    $dsn = "mysql:host=localhost;dbname=raw_sale;charset=utf8";
    $username = "HYL";
    $password = "1018";
    return new PDO($dsn, $username, $password);
}

$db = create_database();
$query = "";

$date = new DateTime();
$result = array();
$result["updated"] = $date->format(DateTime::ISO8601);

if (isset($_GET["action"])) {
    if ($_GET["action"] == "get-sales") {
        if (isset($_GET["attribute"])) {
            if ($_GET["attribute"] == "total") {
                $result["description"] = "Total Sales";

                $query = "SELECT SUM(grand_total) AS total_sales FROM sales_data";
                $rows = $db->query($query);

                $list = array();
                foreach ($rows->fetchAll() as $row) {
                    $item = array();
                    $item["amount"] = (double) $row["total_sales"];
                    $item["currency"] = "CAD";
                    array_push($list, $item);
                }
                $result["result"] = $list;
            } else if ($_GET["attribute"] == "by-location") {
                $result["description"] = "Sales by Location";

                $query = "SELECT SUM(grand_total) AS total_sales, cust_city, cust_province FROM sales_data GROUP BY cust_city";
                if (isset($_GET["sort"])) {
                    if ($_GET["sort"] == "asc") {
                        $query .= " ORDER BY total_sales ASC";
                    } else if ($_GET["sort"] == "desc") {
                        $query .= " ORDER BY total_sales DESC";
                    }
                }
                if (isset($_GET["limit"]) && is_numeric($_GET["limit"])) {
                    $query .= " LIMIT " . ((int) $_GET["limit"]);
                }
                $rows = $db->query($query);

                $list = array();
                foreach ($rows->fetchAll() as $row) {
                    $item = array();
                    $item["amount"] = (double) $row["total_sales"];
                    $item["currency"] = "CAD";
                    $item["city"] = $row["cust_city"];
                    $item["province"] = $row["cust_province"];
                    array_push($list, $item);
                }
                $result["result"] = $list;
            } else if ($_GET["attribute"] == "by-customer") {
                $result["description"] = "Sales by Customer";

                $query = "SELECT SUM(grand_total) AS total_sales, cust_fname FROM sales_data GROUP BY cust_fname";
                if (isset($_GET["sort"])) {
                    if ($_GET["sort"] == "asc") {
                        $query .= " ORDER BY total_sales ASC";
                    } else if ($_GET["sort"] == "desc") {
                        $query .= " ORDER BY total_sales DESC";
                    }
                }
                if (isset($_GET["limit"]) && is_numeric($_GET["limit"])) {
                    $query .= " LIMIT " . ((int) $_GET["limit"]);
                }
                $rows = $db->query($query);

                $list = array();
                foreach ($rows->fetchAll() as $row) {
                    $item = array();
                    $item["amount"] = (double) $row["total_sales"];
                    $item["currency"] = "CAD";
                    $item["firstName"] = $row["cust_fname"];
                    array_push($list, $item);
                }
                $result["result"] = $list;
            } else {
                print_content("HTTP/1.1 400 Bad Request", "The attribute parameter is not recognized.");
            }
        } else {
            print_content("HTTP/1.1 400 Bad Request", "The attribute parameter is missing.");
        }
    } else if ($_GET["action"] == "get-tax") {
        if (isset($_GET["attribute"])) {
            if ($_GET["attribute"] == "total") {
                $result["description"] = "Total Tax";

                $query = "SELECT SUM(tax) AS total_tax FROM sales_data";
                $rows = $db->query($query);

                $list = array();
                foreach ($rows->fetchAll() as $row) {
                    $item = array();
                    $item["amount"] = (double) $row["total_tax"];
                    $item["currency"] = "CAD";
                    array_push($list, $item);
                }
                $result["result"] = $list;
            } else {
                print_content("HTTP/1.1 400 Bad Request", "The attribute parameter is not recognized.");
            }
        } else {
            print_content("HTTP/1.1 400 Bad Request", "The attribute parameter is missing.");
        }
    } else if ($_GET["action"] == "get-shipping") {
        if (isset($_GET["attribute"])) {
            if ($_GET["attribute"] == "total") {
                $result["description"] = "Total Shipping";

                $query = "SELECT SUM(shipping) AS total_shipping FROM sales_data";
                $rows = $db->query($query);

                $list = array();
                foreach ($rows->fetchAll() as $row) {
                    $item = array();
                    $item["amount"] = (double) $row["total_shipping"];
                    $item["currency"] = "CAD";
                    array_push($list, $item);
                }
                $result["result"] = $list;
            } else {
                print_content("HTTP/1.1 400 Bad Request", "The attribute parameter is not recognized.");
            }
        } else {
            print_content("HTTP/1.1 400 Bad Request", "The attribute parameter is missing.");
        }
    } else if ($_GET["action"] == "get-all") {
        if (isset($_GET["attribute"])) {
            if ($_GET["attribute"] == "over-time") {
                $result["description"] = "Sales over Time";

                $query = "SELECT SUM(grand_total) AS total_sales, SUM(tax) AS total_tax, SUM(shipping) AS total_shipping, purchase_date FROM sales_data GROUP BY purchase_date";
                $rows = $db->query($query);

                $list = array();
                foreach ($rows->fetchAll() as $row) {
                    $item = array();
                    $item["date"] = $row["purchase_date"];
                    $item["sales"] = (double) $row["total_sales"];
                    $item["tax"] = (double) $row["total_tax"];
                    $item["shipping"] = (double) $row["total_shipping"];
                    $item["currency"] = "CAD";
                    array_push($list, $item);
                }
                $result["result"] = $list;
            } else {
                print_content("HTTP/1.1 400 Bad Request", "The attribute parameter is not recognized.");
            }
        } else {
            print_content("HTTP/1.1 400 Bad Request", "The attribute parameter is missing.");
        }
    } else if ($_GET["action"] == "get-details") {
        $result["description"] = "Details";

        $query = "SELECT order_id, purchase_date, cust_fname, cust_city, cust_province, tax, shipping, grand_total FROM sales_data";
        $rows = $db->query($query);

        $list = array();
        foreach ($rows->fetchAll() as $row) {
            $item = array();
            $item["orderID"] = $row["order_id"];
            $item["date"] = $row["purchase_date"];
            $item["firstName"] = $row["cust_fname"];
            $item["city"] = $row["cust_city"];
            $item["province"] = $row["cust_province"];
            $item["tax"] = (double) $row["tax"];
            $item["shipping"] = (double) $row["shipping"];
            $item["grandTotal"] = (double) $row["grand_total"];
            array_push($list, $item);
        }
        $result["result"] = $list;
    } else {
        print_content("HTTP/1.1 400 Bad Request", "The action parameter is not recognized.");
    }
} else {
    print_content("HTTP/1.1 400 Bad Request", "The action parameter is missing.");
}

print_content("Content-type: application/json", json_encode($result));