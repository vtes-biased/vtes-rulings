def test_index(client):
    response = client.get("/index.html")
    assert response.status_code == 200
    assert response.headers["Content-Type"] == "text/html; charset=utf-8"
    assert len(response.text) > 100
