
--! create
INSERT INTO comments(blog_id, account_id, content)
VALUES(:blog_id, :account_id, :content)
RETURNING ID;