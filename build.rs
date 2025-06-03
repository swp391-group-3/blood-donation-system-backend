use clorinde::{Error, config::Config};

#[allow(clippy::result_large_err)]
fn main() -> Result<(), Error> {
    let queries_path = "database/queries";
    let schema_file = "schema.sql";

    let cfg = Config::builder()
        .name("database")
        .destination("database/generated")
        .build();

    println!("cargo:rerun-if-changed={queries_path}");
    println!("cargo:rerun-if-changed={schema_file}");
    clorinde::gen_managed(&[schema_file], cfg)?;

    Ok(())
}
