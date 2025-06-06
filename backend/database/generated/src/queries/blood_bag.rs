// This file was generated with `clorinde`. Do not modify.

#[derive(Debug, Clone, PartialEq, Copy)]
pub struct Get {
    pub id: uuid::Uuid,
    pub donation_id: uuid::Uuid,
    pub component: ctypes::BloodComponent,
    pub is_used: bool,
    pub amount: i32,
    pub expired_time: crate::types::time::TimestampTz,
}
#[derive(Debug, Clone, PartialEq, Copy)]
pub struct GetAll {
    pub id: uuid::Uuid,
    pub donation_id: uuid::Uuid,
    pub component: ctypes::BloodComponent,
    pub is_used: bool,
    pub amount: i32,
    pub expired_time: crate::types::time::TimestampTz,
}
use crate::client::async_::GenericClient;
use futures::{self, StreamExt, TryStreamExt};
pub struct GetQuery<'c, 'a, 's, C: GenericClient, T, const N: usize> {
    client: &'c C,
    params: [&'a (dyn postgres_types::ToSql + Sync); N],
    stmt: &'s mut crate::client::async_::Stmt,
    extractor: fn(&tokio_postgres::Row) -> Result<Get, tokio_postgres::Error>,
    mapper: fn(Get) -> T,
}
impl<'c, 'a, 's, C, T: 'c, const N: usize> GetQuery<'c, 'a, 's, C, T, N>
where
    C: GenericClient,
{
    pub fn map<R>(self, mapper: fn(Get) -> R) -> GetQuery<'c, 'a, 's, C, R, N> {
        GetQuery {
            client: self.client,
            params: self.params,
            stmt: self.stmt,
            extractor: self.extractor,
            mapper,
        }
    }
    pub async fn one(self) -> Result<T, tokio_postgres::Error> {
        let stmt = self.stmt.prepare(self.client).await?;
        let row = self.client.query_one(stmt, &self.params).await?;
        Ok((self.mapper)((self.extractor)(&row)?))
    }
    pub async fn all(self) -> Result<Vec<T>, tokio_postgres::Error> {
        self.iter().await?.try_collect().await
    }
    pub async fn opt(self) -> Result<Option<T>, tokio_postgres::Error> {
        let stmt = self.stmt.prepare(self.client).await?;
        Ok(self
            .client
            .query_opt(stmt, &self.params)
            .await?
            .map(|row| {
                let extracted = (self.extractor)(&row)?;
                Ok((self.mapper)(extracted))
            })
            .transpose()?)
    }
    pub async fn iter(
        self,
    ) -> Result<
        impl futures::Stream<Item = Result<T, tokio_postgres::Error>> + 'c,
        tokio_postgres::Error,
    > {
        let stmt = self.stmt.prepare(self.client).await?;
        let it = self
            .client
            .query_raw(stmt, crate::slice_iter(&self.params))
            .await?
            .map(move |res| {
                res.and_then(|row| {
                    let extracted = (self.extractor)(&row)?;
                    Ok((self.mapper)(extracted))
                })
            })
            .into_stream();
        Ok(it)
    }
}
pub struct GetAllQuery<'c, 'a, 's, C: GenericClient, T, const N: usize> {
    client: &'c C,
    params: [&'a (dyn postgres_types::ToSql + Sync); N],
    stmt: &'s mut crate::client::async_::Stmt,
    extractor: fn(&tokio_postgres::Row) -> Result<GetAll, tokio_postgres::Error>,
    mapper: fn(GetAll) -> T,
}
impl<'c, 'a, 's, C, T: 'c, const N: usize> GetAllQuery<'c, 'a, 's, C, T, N>
where
    C: GenericClient,
{
    pub fn map<R>(self, mapper: fn(GetAll) -> R) -> GetAllQuery<'c, 'a, 's, C, R, N> {
        GetAllQuery {
            client: self.client,
            params: self.params,
            stmt: self.stmt,
            extractor: self.extractor,
            mapper,
        }
    }
    pub async fn one(self) -> Result<T, tokio_postgres::Error> {
        let stmt = self.stmt.prepare(self.client).await?;
        let row = self.client.query_one(stmt, &self.params).await?;
        Ok((self.mapper)((self.extractor)(&row)?))
    }
    pub async fn all(self) -> Result<Vec<T>, tokio_postgres::Error> {
        self.iter().await?.try_collect().await
    }
    pub async fn opt(self) -> Result<Option<T>, tokio_postgres::Error> {
        let stmt = self.stmt.prepare(self.client).await?;
        Ok(self
            .client
            .query_opt(stmt, &self.params)
            .await?
            .map(|row| {
                let extracted = (self.extractor)(&row)?;
                Ok((self.mapper)(extracted))
            })
            .transpose()?)
    }
    pub async fn iter(
        self,
    ) -> Result<
        impl futures::Stream<Item = Result<T, tokio_postgres::Error>> + 'c,
        tokio_postgres::Error,
    > {
        let stmt = self.stmt.prepare(self.client).await?;
        let it = self
            .client
            .query_raw(stmt, crate::slice_iter(&self.params))
            .await?
            .map(move |res| {
                res.and_then(|row| {
                    let extracted = (self.extractor)(&row)?;
                    Ok((self.mapper)(extracted))
                })
            })
            .into_stream();
        Ok(it)
    }
}
pub fn get() -> GetStmt {
    GetStmt(crate::client::async_::Stmt::new(
        "SELECT id, donation_id, component, is_used, amount, expired_time FROM blood_bags WHERE id = $1",
    ))
}
pub struct GetStmt(crate::client::async_::Stmt);
impl GetStmt {
    pub fn bind<'c, 'a, 's, C: GenericClient>(
        &'s mut self,
        client: &'c C,
        id: &'a uuid::Uuid,
    ) -> GetQuery<'c, 'a, 's, C, Get, 1> {
        GetQuery {
            client,
            params: [id],
            stmt: &mut self.0,
            extractor: |row: &tokio_postgres::Row| -> Result<Get, tokio_postgres::Error> {
                Ok(Get {
                    id: row.try_get(0)?,
                    donation_id: row.try_get(1)?,
                    component: row.try_get(2)?,
                    is_used: row.try_get(3)?,
                    amount: row.try_get(4)?,
                    expired_time: row.try_get(5)?,
                })
            },
            mapper: |it| Get::from(it),
        }
    }
}
pub fn get_all() -> GetAllStmt {
    GetAllStmt(crate::client::async_::Stmt::new(
        "SELECT id, donation_id, component, is_used, amount, expired_time FROM blood_bags",
    ))
}
pub struct GetAllStmt(crate::client::async_::Stmt);
impl GetAllStmt {
    pub fn bind<'c, 'a, 's, C: GenericClient>(
        &'s mut self,
        client: &'c C,
    ) -> GetAllQuery<'c, 'a, 's, C, GetAll, 0> {
        GetAllQuery {
            client,
            params: [],
            stmt: &mut self.0,
            extractor: |row: &tokio_postgres::Row| -> Result<GetAll, tokio_postgres::Error> {
                Ok(GetAll {
                    id: row.try_get(0)?,
                    donation_id: row.try_get(1)?,
                    component: row.try_get(2)?,
                    is_used: row.try_get(3)?,
                    amount: row.try_get(4)?,
                    expired_time: row.try_get(5)?,
                })
            },
            mapper: |it| GetAll::from(it),
        }
    }
}
