import { useParams } from "react-router-dom";
import { Image, useOrganizationService } from "../../../Services/OrganizationService";
import ContentBanner from "../Blocks/ContentBanner";
import { Stack, Grid, Textarea } from "@mui/joy";
import { Rating } from '@mui/material';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import GlassBox from "../Blocks/GlassBox";

import './Workspace.css';

import { MiniMap } from "../Blocks/Maps";
import { faStar } from "@fortawesome/free-solid-svg-icons";

const Workspace = () => {
    const { id } = useParams();

    const workspace = useOrganizationService().getJobById(id);
    const organization = useOrganizationService().getOrganizationByJobId(id);

    const name = organization?.organization_name;
    const position = workspace?.job_position;
    const coords: [number, number] = [Number(workspace?.job_location.coordinates.longitude), Number(workspace?.job_location.coordinates.latitude)];
    const address = workspace?.job_location.full_address;
    const availablePositions = workspace?.available_positions;
    const skills = workspace?.skills_required;
    const images: Image[] = organization?.organization_content.images;
    const description = organization?.organization_content.long_description;
    const reviews = organization?.organization_content.reviews;
    const workingHours = workspace?.job_hours

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
                                {images.map((img) => (
                                    <div className={`carousel-item ${img.id === 0 ? "active" : ""}`}>
                                        <img src={img.url + "/" + img.id} className="d-block w-100 carousel-img" alt={img.caption} loading="lazy" />
                                    </div>
                                ))}
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
                        <h3>{position}</h3>
                    </GlassBox>
                    <GlassBox padding="1.2rem" bgColor="#2835a1" opacity={0.5}>
                        <h4>Available Positions: {availablePositions}</h4>
                    </GlassBox>
                    <GlassBox padding="2rem" bgColor="#2835a1" opacity={0.5}>
                        <p>{description}</p>
                    </GlassBox>
                    <GlassBox padding="2rem" bgColor="#2835a1" opacity={0.5}>
                        <div style={{ marginTop: '1rem' }}>
                            <table className="hours-table">
                                <thead >
                                    <tr style={{ padding: '50rem' }}>
                                        <th>Days</th>
                                        <th >Operating Hours</th>
                                    </tr>
                                </thead>
                                <tbody >
                                    {workingHours?.map((day) => (
                                        <tr>
                                            <td>{day.weekDay}</td>
                                            <td>
                                                {(day.opening_time || day.closing_time) ?
                                                    (day.opening_time + " - " + day.closing_time).toUpperCase() :
                                                    "Closed"
                                                }
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </GlassBox>
                    <GlassBox padding="2rem" bgColor="#2835a1" opacity={0.5}>
                        <h3>Preferred Skills:</h3>
                        {skills?.map((index) => (
                            <h4 style={{ paddingTop: '0.5rem', fontSize: '1.3rem' }}>{index}</h4>
                        ))}
                    </GlassBox>
                </Stack>
            </Grid>
            <Grid xs={8}>
                <Stack direction='column' spacing={5}>
                    <GlassBox padding="2rem" bgColor="#2835a1" opacity={0.5}>
                        <h2>{name}</h2>
                    </GlassBox>
                    <GlassBox padding="2rem" bgColor="#2835a1" opacity={0.5}>
                        <MiniMap worksiteLngLat={coords} />
                    </GlassBox>
                    <GlassBox padding="2rem" bgColor="#2835a1" opacity={0.5}>
                        <h4>{address}</h4>
                    </GlassBox>
                    <GlassBox padding="2rem" bgColor="#2835a1" opacity={0.5}>
                        <h3 style={{ display: 'inlineBlock' }}>Reviews
                            <Rating
                                value={reviews?.average_rating}
                                icon={<FontAwesomeIcon icon={faStar} />}
                                emptyIcon={<FontAwesomeIcon opacity={0.55} icon={faStar} />}
                                readOnly
                            />
                        </h3>
                    </GlassBox>
                    <div className="reviewContainer">
                        {reviews?.individual_reviews.map(review => (
                            <GlassBox padding="2rem" bgColor="#2835a1" opacity={0.5} style={{ boxShadow: 'none' }}>
                                <h4>{review.author}</h4>
                                <Rating
                                    value={review.rating}
                                    icon={<FontAwesomeIcon icon={faStar} />}
                                    emptyIcon={<FontAwesomeIcon opacity={0.55} icon={faStar} />}
                                    readOnly
                                />
                                <p>{review.comment}</p>
                            </GlassBox>
                        ))}
                    </div>
                </Stack>
            </Grid>
        </Grid >
    );
};

export default Workspace;