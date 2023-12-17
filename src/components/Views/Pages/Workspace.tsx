import { useParams } from "react-router-dom";
import { useOrganizationService } from "../../../Services/OrganizationService";
import ContentBanner from "../Blocks/ContentBanner";
import { Stack, Grid, Textarea } from "@mui/joy";
import GlassBox from "../Blocks/GlassBox";

import './Workspace.css';

import { MiniMap } from "../Blocks/Maps";

const Workspace = () => {
    const { id } = useParams();

    const workspace = useOrganizationService().getOrganizationById(id);

    const name = workspace?.organization_name;
    const coords: [number, number] = [Number(workspace?.address.coordinates.longitude), Number(workspace?.address.coordinates.latitude)];
    const address = workspace?.address.street + ', ' + workspace?.address.city + ', ' + workspace?.address.state + ' ' + workspace?.address.postal_code;
    const description = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem asperiores repellat numquam deserunt placeat! Odit delectus possimus, temporibus commodi blanditiis rem illo at eum voluptate sapiente molestiae atque laudantium ducimus?; Soluta, delectus quaerat.Veritatis deleniti et doloribus modi molestiae repellendus quas earum voluptatum, doloremque animi consequuntur! Sequi voluptas obcaecati deserunt excepturi corrupti illum pariatur sapiente dicta commodi voluptate ? Dolores, totam. Molestiae quibusdam dolorem sapiente saepe, recusandae repellat incidunt laborum voluptates.Sint, excepturi! Quam, modi, quis, distinctio amet inventore deleniti commodi nostrum deserunt iste praesentium aperiam asperiores consequuntur ducimus illo odio. Itaque, tempore libero."


    if (!workspace) {
        return (
            <ContentBanner size="full" bgColor="#a0a0b0">
                <h2 style={{ textAlign: 'center' }}>Workspace Not Found</h2>
            </ContentBanner>
        );
    }

    return (
        <Grid className='workspace-container' container spacing={5} columns={16}>
            <Grid xs={8}>
                <Stack direction='column' spacing={5}>
                    <GlassBox padding="2rem" bgColor="#2835a1" opacity={0.5}>
                        <div id="carouselExample" className="carousel slide carousel-fade" data-bs-ride="carousel" >
                            <div className="carousel-inner" style={{ borderRadius: '2rem' }}>
                                <div className="carousel-item active">
                                    <img src="https://www.searchenginejournal.com/wp-content/uploads/2022/06/image-search-1600-x-840-px-62c6dc4ff1eee-sej.png" style={{ height: '20rem' }} className="d-block w-100" alt="..." />
                                </div>
                                <div className="carousel-item">
                                    <img src="https://imagekit.io/blog/content/images/2019/12/image-optimization.jpg" style={{ height: '20rem' }} className="d-block w-100" alt="..." />
                                </div>
                                <div className="carousel-item">
                                    <img src="https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg" style={{ height: '20rem' }} className="d-block w-100" alt="..." />
                                </div>
                            </div>
                            <button className="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
                                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span className="visually-hidden">Previous</span>
                            </button>
                            <button className="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
                                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                <span className="visually-hidden">Next</span>
                            </button>
                        </div>
                    </GlassBox>
                    <GlassBox padding="2rem" bgColor="#2835a1" opacity={0.5}>
                        <p>{description}</p>
                    </GlassBox>
                </Stack>
            </Grid>
            <Grid xs={8}>
                <Stack direction='column' spacing={5}>
                    <GlassBox padding="2rem" bgColor="#2835a1" opacity={0.5}>
                        <h2>{name}</h2>
                    </GlassBox>
                    <GlassBox padding="2rem" bgColor="#2835a1" opacity={0.5}>
                        <MiniMap worksiteLngLat={coords} currentLngLat={[-118.2551, 34.1425]} />
                        <h3>Address: {address}</h3>
                    </GlassBox>
                    <GlassBox padding="2rem" bgColor="#2835a1" opacity={0.5}>
                        <h3>Reviews</h3>
                        <div></div>
                    </GlassBox>
                </Stack>
            </Grid>
        </Grid >
    );
};

export default Workspace;